import { NextRequest, NextResponse } from "next/server";
import groq, { GROQ_MODEL } from "@/lib/groq";
import { LAB_REPORT_SYSTEM_PROMPT } from "@/lib/prompts/lab_report_prompt";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportText, userId } = body;

    if (!reportText || typeof reportText !== "string" || reportText.trim().length < 5) {
      return NextResponse.json(
        { error: "Please upload an image or provide extracted medical report text to analyze" },
        { status: 400 }
      );
    }

    // Retrieve patient profile for personalized clinical alerts
    let profileContext = "No recorded patient profile.";
    if (userId) {
      if (String(userId) === "999") {
        profileContext = `Patient: Ahmad Khan (Age 54, Male).
Known Chronic Conditions: Type 2 Diabetes, Hypertension.
Recorded Allergies: Sulfa, Penicillin.
Current Medications: Metformin 500mg, Amlodipine 5mg.`;
      } else {
        const row = db
          .prepare(`
            SELECT u.name, p.age, p.gender, p.conditions, p.allergies, p.current_medications
            FROM users u
            LEFT JOIN health_profiles p ON u.id = p.user_id
            WHERE u.id = ?
          `)
          .get(userId) as Record<string, unknown> | undefined;

        if (row) {
          profileContext = `Patient: ${row.name || "Patient"} (Age: ${row.age || "N/A"}, Gender: ${row.gender || "N/A"}).
Known Chronic Conditions: ${row.conditions || "None"}.
Recorded Allergies: ${row.allergies || "None"}.
Current Medications: ${row.current_medications || "None"}.`;
        }
      }
    }

    const userPrompt = `[PATIENT HEALTH PROFILE]
${profileContext}

[OCR-EXTRACTED MEDICAL / LAB REPORT TEXT]
"""
${reportText.trim().slice(0, 4000)}
"""

Analyze all lab values and findings above, classify each marker as high, low, or normal against standard ranges, explain them clearly in simple English and Urdu, and note any important connections to the patient's chronic conditions or medications.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: LAB_REPORT_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 4096,
      ...({ reasoning_effort: "low" } as Record<string, unknown>),
    });

    const rawContent = completion.choices[0]?.message?.content || "{}";
    let parsedAnalysis: Record<string, unknown>;
    try {
      parsedAnalysis = JSON.parse(rawContent);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse structured lab report analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: parsedAnalysis,
    });
  } catch (error: unknown) {
    console.error("Report Analyze API error:", error);
    const msg =
      error instanceof Error ? error.message : "Failed to analyze medical report";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
