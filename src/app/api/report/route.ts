import { NextRequest, NextResponse } from "next/server";
import groq, { GROQ_MODEL } from "@/lib/groq";
import { DOCTOR_REPORT_SYSTEM_PROMPT } from "@/lib/prompts/report_prompt";
import { retrieveDetailedContext } from "@/lib/rag/retriever";
import { getDb } from "@/lib/db";

interface IntakeQA {
  question: string;
  answer: string;
}

interface ChatMsg {
  role: string;
  content: string;
}

const MIN_REQUIRED_QUESTIONS = 3;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      intakeAnswers,
      messages,
      labReportSummary,
    }: {
      userId?: number | string;
      intakeAnswers?: IntakeQA[];
      messages?: ChatMsg[];
      labReportSummary?: string | null;
    } = body;

    // Validate multi-question requirement (NEVER generate on just 1 question)
    let formattedIntake = "";
    let combinedUserText = "";
    let answeredCount = 0;

    if (Array.isArray(intakeAnswers) && intakeAnswers.length > 0) {
      const validAnswers = intakeAnswers.filter(
        (qa) => qa && typeof qa.answer === "string" && qa.answer.trim().length > 0
      );
      answeredCount = validAnswers.length;
      formattedIntake = validAnswers
        .map((qa, i) => `Q${i + 1}: ${qa.question}\nPatient Answer: ${qa.answer.trim()}`)
        .join("\n\n");
      combinedUserText = validAnswers.map((qa) => qa.answer.trim()).join(" ");
    } else if (Array.isArray(messages) && messages.length > 0) {
      const userTurns = messages.filter(
        (m) => m && m.role === "user" && typeof m.content === "string" && m.content.trim().length > 0
      );
      answeredCount = userTurns.length;
      formattedIntake = messages
        .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
        .map((m) => `${m.role === "user" ? "Patient" : "TabeebCare AI"}: ${m.content.trim()}`)
        .join("\n\n");
      combinedUserText = userTurns.map((m) => m.content.trim()).join(" ");
    }

    if (answeredCount < MIN_REQUIRED_QUESTIONS) {
      return NextResponse.json(
        {
          error: `Please answer at least ${MIN_REQUIRED_QUESTIONS} clinical intake questions before generating a comprehensive doctor report (currently ${answeredCount}/${MIN_REQUIRED_QUESTIONS}).`,
          answeredCount,
          requiredCount: MIN_REQUIRED_QUESTIONS,
        },
        { status: 400 }
      );
    }

    // Retrieve patient profile for Background section
    let profileText = "No recorded health profile.";
    let activeUserId: number | null = null;

    if (userId) {
      if (String(userId) === "999") {
        profileText = `Name: Ahmad Khan (احمد خان)
Age: 54 | Gender: Male
Chronic Conditions: Type 2 Diabetes, Hypertension
Known Allergies: Sulfa, Penicillin
Current Medications: Metformin 500mg, Amlodipine 5mg`;
      } else {
        try {
          const db = await getDb();
          const result = await db.execute({
            sql: `
              SELECT u.name, p.age, p.gender, p.conditions, p.allergies, p.current_medications
              FROM users u
              LEFT JOIN health_profiles p ON u.id = p.user_id
              WHERE u.id = ?
            `,
            args: [Number(userId)],
          });
          const row = result.rows[0] as Record<string, unknown> | undefined;

          if (row) {
            activeUserId = Number(userId);
            profileText = `Name: ${row.name || "Patient"}
Age: ${row.age || "Not specified"} | Gender: ${row.gender || "Not specified"}
Chronic Conditions: ${row.conditions || "None"}
Known Allergies: ${row.allergies || "None"}
Current Medications: ${row.current_medications || "None"}`;
          }
        } catch (dbErr) {
          console.warn("Doctor Report profile lookup skipped:", dbErr);
        }
      }
    }

    // Ground the report with WHO-inspired clinical RAG protocols
    const ragResult = retrieveDetailedContext(combinedUserText);

    const userPrompt = `[PATIENT HEALTH PROFILE]
${profileText}

[MULTI-QUESTION CLINICAL INTAKE (${answeredCount} RESPONSES)]
${formattedIntake}

${labReportSummary ? `[ATTACHED MEDICAL / LAB REPORT FINDINGS]\n${labReportSummary}\n` : ""}
${ragResult.contextText ? `[MATCHED CLINICAL PROTOCOLS]\n${ragResult.contextText}\n` : ""}
Synthesize ALL patient answers above into a concise, accurate SBAR Doctor Handover Report in strict JSON format (1-2 crisp sentences per field, both English and Urdu).`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: DOCTOR_REPORT_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 4096,
      // Keep reasoning fast on reasoning models so JSON output never truncates
      ...({ reasoning_effort: "low" } as Record<string, unknown>),
    });

    const rawContent = completion.choices[0]?.message?.content || "{}";
    let parsedReport: Record<string, unknown>;
    try {
      parsedReport = JSON.parse(rawContent);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse structured doctor report JSON" },
        { status: 500 }
      );
    }

    // Sanitize array fields against occasional nested LLM JSON artifacts
    const cleanStringArray = (val: unknown): string[] => {
      if (!Array.isArray(val)) return [];
      return val
        .filter(
          (item): item is string =>
            typeof item === "string" &&
            item.trim().length > 3 &&
            !/^[\]\[\{\}:,]+$/.test(item.trim()) &&
            !item.includes("questions_for_doctor")
        )
        .map((s) => s.trim())
        .slice(0, 6);
    };

    if (parsedReport.timeline_en) parsedReport.timeline_en = cleanStringArray(parsedReport.timeline_en);
    if (parsedReport.timeline_ur) parsedReport.timeline_ur = cleanStringArray(parsedReport.timeline_ur);
    if (parsedReport.questions_for_doctor_en) {
      parsedReport.questions_for_doctor_en = cleanStringArray(parsedReport.questions_for_doctor_en).slice(0, 3);
    }
    if (parsedReport.questions_for_doctor_ur) {
      parsedReport.questions_for_doctor_ur = cleanStringArray(parsedReport.questions_for_doctor_ur).slice(0, 3);
    }

    // Save synthesized report to SQLite triage_sessions for persistent users
    if (activeUserId) {
      try {
        const level =
          typeof parsedReport.triage_level === "string"
            ? parsedReport.triage_level
            : ragResult.highestSeverity || "routine";
        const summary =
          typeof parsedReport.chief_complaint_en === "string"
            ? parsedReport.chief_complaint_en
            : "Multi-question Doctor SBAR Report";
        const db = await getDb();
        await db.execute({
          sql: `
            INSERT INTO triage_sessions (user_id, messages, triage_level, summary)
            VALUES (?, ?, ?, ?)
          `,
          args: [
            activeUserId,
            JSON.stringify(intakeAnswers || messages || []),
            level,
            summary,
          ],
        });
      } catch (dbErr) {
        console.error("Failed to persist doctor report session:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      answeredCount,
      matchedProtocols: ragResult.matchedProtocols.map((p) => ({
        id: p.id,
        title: p.title,
      })),
      report: parsedReport,
    });
  } catch (error: unknown) {
    console.error("Doctor Report API error:", error);
    const msg =
      error instanceof Error ? error.message : "Failed to generate doctor report";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
