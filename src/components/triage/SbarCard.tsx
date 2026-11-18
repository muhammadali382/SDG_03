"use client";

import React, { useState } from "react";
import {
  FileText,
  Printer,
  X,
  HeartPulse,
  Download,
  Check,
  Copy,
  HelpCircle,
  FlaskConical,
  ListChecks,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useUser } from "@/context/UserContext";

export interface StructuredDoctorReport {
  triage_level?: string;
  chief_complaint_en?: string;
  chief_complaint_ur?: string;
  situation_en?: string;
  situation_ur?: string;
  timeline_en?: string[];
  timeline_ur?: string[];
  assessment_en?: string;
  assessment_ur?: string;
  lab_findings_summary_en?: string | null;
  lab_findings_summary_ur?: string | null;
  recommendations_en?: string;
  recommendations_ur?: string;
  questions_for_doctor_en?: string[];
  questions_for_doctor_ur?: string[];
}

interface SbarCardProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientAge?: number | null;
  patientGender?: string | null;
  conditions?: string[];
  allergies?: string[];
  medications?: string[];
  situation: string;
  assessment: string;
  triageLevel?: string;
  structuredReport?: StructuredDoctorReport | null;
  answeredQuestionsCount?: number;
}

export function SbarCard({
  isOpen,
  onClose,
  patientName = "Patient",
  patientAge,
  patientGender,
  conditions = [],
  allergies = [],
  medications = [],
  situation,
  assessment,
  triageLevel = "Clinical Evaluation",
  structuredReport = null,
  answeredQuestionsCount,
}: SbarCardProps) {
  const { lang } = useUser();
  const [cardLang, setCardLang] = useState<"en" | "ur">(lang === "ur" ? "ur" : "en");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isUrdu = cardLang === "ur";
  const effectiveLevel = structuredReport?.triage_level || triageLevel || "Clinical Evaluation";

  const getUrduTriageLevel = (lvl: string) => {
    const lower = lvl.toLowerCase();
    if (lower.includes("emergency")) return "🚨 ہنگامی صورتحال (Emergency)";
    if (lower.includes("urgent")) return "⚠️ فوری طبی توجہ (Urgent Care)";
    if (lower.includes("routine")) return "ℹ️ معمول کا چیک اپ (Routine Care)";
    if (lower.includes("home")) return "🟢 گھریلو دیکھ بھال (Home Care)";
    return lvl;
  };

  const fallbackAssessment = assessment
    .replace(/^TRIAGE_LEVEL:\s*\w+\s*/i, "")
    .replace(/^---\s*/, "")
    .trim();

  const displaySituation = isUrdu
    ? structuredReport?.situation_ur || situation || "مریض نے متعدد سوالات کے دوران علامات رپورٹ کیں۔"
    : structuredReport?.situation_en || situation || "Patient reported acute symptoms during multi-question intake.";

  const displayTimeline = isUrdu
    ? structuredReport?.timeline_ur || structuredReport?.timeline_en || []
    : structuredReport?.timeline_en || [];

  const displayLabFindings = isUrdu
    ? structuredReport?.lab_findings_summary_ur || structuredReport?.lab_findings_summary_en || null
    : structuredReport?.lab_findings_summary_en || null;

  const displayAssessment = isUrdu
    ? structuredReport?.assessment_ur || fallbackAssessment || "ڈبلیو ایچ او کلینیکل پروٹوکول کے تحت جائزہ تیار کیا گیا۔"
    : structuredReport?.assessment_en || fallbackAssessment || "Clinical assessment generated through WHO-inspired triage protocols.";

  const displayRecommendation = isUrdu
    ? structuredReport?.recommendations_ur ||
      "فزیکل معائنہ، اہم علامات کی تصدیق (بلڈ پریشر، نبض/دل کی دھڑکن، آکسیجن، بلڈ شوگر لیول) اور معالج ڈاکٹر کے فیصلے کے مطابق تشخیصی ورک اپ۔"
    : structuredReport?.recommendations_en ||
      "Physical examination, vital signs verification (BP, Heart Rate, SpO2, Blood Sugar), and clinical diagnostic workup as indicated by physician.";

  const displayDoctorQuestions = isUrdu
    ? structuredReport?.questions_for_doctor_ur || structuredReport?.questions_for_doctor_en || []
    : structuredReport?.questions_for_doctor_en || [];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const dateStr = new Date().toLocaleDateString("en-GB");
    const timeStr = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const timelineBlock =
      displayTimeline.length > 0
        ? `\n${isUrdu ? "[علامات کی تفصیل / ٹائم لائن]" : "[INTAKE TIMELINE]"}\n${displayTimeline
            .map((t) => `- ${t}`)
            .join("\n")}\n`
        : "";

    const labBlock = displayLabFindings
      ? `\n${isUrdu ? "[منسلک لیب رپورٹ نتائج]" : "[ATTACHED LAB REPORT FINDINGS]"}\n${displayLabFindings}\n`
      : "";

    const questionsBlock =
      displayDoctorQuestions.length > 0
        ? `\n${isUrdu ? "[ڈاکٹر سے پوچھنے کے سوالات]" : "[QUESTIONS TO ASK YOUR DOCTOR]"}\n${displayDoctorQuestions
            .map((q, i) => `${i + 1}. ${q}`)
            .join("\n")}\n`
        : "";

    const fileContent = isUrdu
      ? `============================================================
طبیب کیئر — جامع ڈاکٹر کلینیکل ہینڈ اوور رپورٹ (SBAR)
تاریخ: ${dateStr} ${timeStr}
${answeredQuestionsCount ? `کل انٹیک سوالات: ${answeredQuestionsCount}` : ""}
============================================================

[مریض کی تفصیلات]
- نام: ${patientName}
- عمر و جنس: ${patientAge ? `${patientAge} سال` : "معلوم نہیں"} • ${patientGender || "معلوم نہیں"}
- ہنگامی ترجیح: ${getUrduTriageLevel(effectiveLevel)}
- معلوم الرجی: ${allergies.length > 0 ? allergies.join(", ") : "کوئی معلوم الرجی درج نہیں"}

------------------------------------------------------------
[S] صورتحال (SITUATION):
${displaySituation}
${timelineBlock}
------------------------------------------------------------
[B] پس منظر (BACKGROUND):
- دائمی امراض: ${conditions.length > 0 ? conditions.join(", ") : "کوئی نہیں"}
- موجودہ ادویات: ${medications.length > 0 ? medications.join(", ") : "کوئی نہیں"}
${labBlock}
------------------------------------------------------------
[A] کلینیکل جائزہ (ASSESSMENT):
${displayAssessment}

------------------------------------------------------------
[R] ڈاکٹر کے لیے سفارشات (RECOMMENDATION):
${displayRecommendation}
${questionsBlock}
============================================================
نوٹ: یہ رپورٹ طبیب کیئر تعلیمی و ٹریآج سسٹم نے تیار کی ہے۔
یہ حتمی طبی تشخیص کا نعم البدل نہیں ہے۔
============================================================`
      : `============================================================
TABEEBCARE COMPREHENSIVE DOCTOR HANDOVER REPORT (SBAR)
Date: ${dateStr} ${timeStr}
${answeredQuestionsCount ? `Synthesized From: ${answeredQuestionsCount} Clinical Intake Questions` : ""}
============================================================

[PATIENT OVERVIEW]
- Name: ${patientName}
- Demographics: ${patientAge ? `${patientAge} yrs` : "N/A"} • ${patientGender || "N/A"}
- Triage Urgency: ${effectiveLevel.toUpperCase()}
- Known Allergies: ${allergies.length > 0 ? allergies.join(", ") : "None reported"}

------------------------------------------------------------
[S] SITUATION (Presenting Complaint):
${displaySituation}
${timelineBlock}
------------------------------------------------------------
[B] BACKGROUND (Medical History & Medications):
- Chronic Conditions: ${conditions.length > 0 ? conditions.join(", ") : "None recorded"}
- Current Medications: ${medications.length > 0 ? medications.join(", ") : "None reported"}
${labBlock}
------------------------------------------------------------
[A] ASSESSMENT (Clinical Observations):
${displayAssessment}

------------------------------------------------------------
[R] RECOMMENDATION (Suggested Clinical Workup):
${displayRecommendation}
${questionsBlock}
============================================================
DISCLAIMER: Prepared via TabeebCare for educational triage navigation.
It does not replace professional medical diagnosis or treatment.
============================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TabeebCare_Doctor_Report_${patientName.replace(/\s+/g, "_")}_${dateStr.replace(/\//g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const textToCopy = `TabeebCare SBAR Doctor Report (${patientName} | ${effectiveLevel.toUpperCase()}):\nSituation: ${displaySituation}\nAssessment: ${displayAssessment}\nRecommendation: ${displayRecommendation}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 flex flex-wrap items-center gap-2">
                <span>
                  {isUrdu
                    ? "جامع ڈاکٹر کلینیکل رپورٹ (SBAR)"
                    : "Comprehensive Doctor Report (SBAR Summary)"}
                </span>
                {answeredQuestionsCount && answeredQuestionsCount >= 3 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                    {isUrdu
                      ? `${answeredQuestionsCount} سوالات سے تیار کردہ`
                      : `${answeredQuestionsCount}-Question Synthesis`}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {isUrdu
                  ? "ڈاکٹر کے معائنے کے لیے جامع کلینیکل خلاصہ"
                  : "Multi-question clinical intake summary ready for your consulting physician"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/70 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCardLang("en")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  !isUrdu
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setCardLang("ur")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  isUrdu
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                اردو
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Body */}
        <div
          dir={isUrdu ? "rtl" : "ltr"}
          className={`p-5 sm:p-7 overflow-y-auto space-y-5 text-sm text-slate-700 print:p-0 ${
            isUrdu ? "font-sans leading-relaxed" : ""
          }`}
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg block">
                  {isUrdu ? "طبیب کیئر کلینیکل ہینڈ اوور" : "TabeebCare Clinical Handover"}
                </span>
                <span className="text-[11px] text-teal-700 font-semibold">
                  {isUrdu
                    ? "طبیب کیئر ایس ڈی جی 3 ہیلتھ نیویگیشن سسٹم"
                    : "TabeebCare Clinical SBAR Card • UN SDG 3"}
                </span>
              </div>
            </div>
            <div className={`${isUrdu ? "text-left" : "text-right"} text-xs text-slate-500 font-mono`}>
              <p>{isUrdu ? "تاریخ" : "Date"}: {new Date().toLocaleDateString("en-GB")}</p>
              <p className="text-[11px] text-slate-400">
                {isUrdu ? "پروٹوکول: ڈبلیو ایچ او گائیڈ لائنز" : "Protocol: WHO-Inspired RAG"}
              </p>
            </div>
          </div>

          {/* Patient Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                {isUrdu ? "مریض کا نام" : "Patient Name"}
              </span>
              <strong className="text-slate-900 text-sm block mt-0.5">{patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                {isUrdu ? "عمر و جنس" : "Demographics"}
              </span>
              <strong className="text-slate-900 block mt-0.5">
                {patientAge ? `${patientAge} ${isUrdu ? "سال" : "yrs"}` : "N/A"} • {patientGender || "N/A"}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                {isUrdu ? "ہنگامی ترجیح" : "Triage Urgency"}
              </span>
              <span className="font-extrabold text-teal-700 text-xs block mt-0.5">
                {isUrdu ? getUrduTriageLevel(effectiveLevel) : effectiveLevel.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                {isUrdu ? "معلوم الرجی" : "Known Allergies"}
              </span>
              <span className="font-bold text-red-600 block mt-0.5">
                {allergies.length > 0
                  ? allergies.join(", ")
                  : isUrdu
                  ? "کوئی الرجی درج نہیں"
                  : "None reported"}
              </span>
            </div>
          </div>

          {/* SBAR Clinical Sections */}
          <div className="space-y-4">
            {/* Situation */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                {isUrdu
                  ? "S — Situation (مریض کی فوری صورتحال اور شکایت)"
                  : "S — Situation (Presenting Complaint)"}
              </h4>
              <p
                className={`text-xs sm:text-sm text-slate-800 leading-relaxed ${
                  isUrdu ? "pr-3.5 border-r-2" : "pl-3.5 border-l-2"
                } border-teal-200`}
              >
                {displaySituation}
              </p>

              {/* Multi-question timeline bullets */}
              {displayTimeline.length > 0 && (
                <div
                  className={`pt-2 ${
                    isUrdu ? "pr-3.5 border-r-2" : "pl-3.5 border-l-2"
                  } border-teal-100 space-y-1`}
                >
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <ListChecks className="w-3.5 h-3.5 text-teal-600" />
                    {isUrdu ? "انٹیک سوالات کا خلاصہ:" : "Key Intake Findings:"}
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                    {displayTimeline.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Background */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                {isUrdu
                  ? "B — Background (طبی پس منظر اور موجودہ ادویات)"
                  : "B — Background (Medical History & Medications)"}
              </h4>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs ${
                  isUrdu ? "pr-3.5 border-r-2" : "pl-3.5 border-l-2"
                } border-teal-200`}
              >
                <div>
                  <strong className="text-slate-700 block mb-0.5">
                    {isUrdu ? "دائمی امراض:" : "Chronic Conditions:"}
                  </strong>
                  <span className="text-slate-600">
                    {conditions.length > 0
                      ? conditions.join(", ")
                      : isUrdu
                      ? "کوئی دائمی مرض درج نہیں"
                      : "None recorded"}
                  </span>
                </div>
                <div>
                  <strong className="text-slate-700 block mb-0.5">
                    {isUrdu ? "موجودہ ادویات:" : "Current Medications:"}
                  </strong>
                  <span className="text-slate-600">
                    {medications.length > 0
                      ? medications.join(", ")
                      : isUrdu
                      ? "کوئی دوا درج نہیں"
                      : "None reported"}
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Attached Lab Report Findings */}
            {displayLabFindings && (
              <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-1.5">
                <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  {isUrdu ? "منسلک لیب رپورٹ نتائج (OCR تجزیہ)" : "Attached Lab Report Findings (OCR)"}
                </h4>
                <p
                  className={`text-xs sm:text-sm text-sky-950 leading-relaxed ${
                    isUrdu ? "pr-3.5 border-r-2 border-sky-300" : "pl-3.5 border-l-2 border-sky-300"
                  }`}
                >
                  {displayLabFindings}
                </p>
              </div>
            )}

            {/* Assessment */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                {isUrdu
                  ? "A — Assessment (کلینیکل جائزہ اور علامات کا تجزیہ)"
                  : "A — Assessment (Clinical Symptoms & Observations)"}
              </h4>
              <div
                className={`text-xs sm:text-sm text-slate-800 leading-relaxed ${
                  isUrdu ? "pr-3.5 border-r-2" : "pl-3.5 border-l-2"
                } border-teal-200 whitespace-pre-wrap max-h-48 overflow-y-auto`}
              >
                {displayAssessment}
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 space-y-1">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                {isUrdu
                  ? "R — Recommendation (ڈاکٹر کے معائنے کے لیے تجاویز)"
                  : "R — Recommendation (Suggested Clinical Focus)"}
              </h4>
              <p
                className={`text-xs sm:text-sm text-teal-950 leading-relaxed ${
                  isUrdu ? "pr-3.5 border-r-2 border-teal-400" : "pl-3.5 border-l-2 border-teal-400"
                }`}
              >
                {displayRecommendation}
              </p>
            </div>

            {/* Questions to Ask Doctor */}
            {displayDoctorQuestions.length > 0 && (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  {isUrdu
                    ? "ڈاکٹر سے پوچھنے کے لیے اہم سوالات"
                    : "Questions to Ask Your Doctor (3-Min Visit Prep)"}
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1">
                  {displayDoctorQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {isUrdu
                ? "طبیب کیئر ایس ڈی جی 3 سسٹم کے تحت تیار کردہ"
                : "Prepared via TabeebCare SDG 3 Outreach System"}
            </span>
            <span>
              {isUrdu
                ? "تعلیمی و ترجیحی رہنمائی • حتمی تشخیص نہیں"
                : "Educational Support Only • Not a Final Diagnosis"}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-2xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{isUrdu ? "کاپی ہو گیا" : "Copied"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isUrdu ? "خلاصہ کاپی کریں" : "Copy Summary"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>{isUrdu ? "فائل ڈاؤن لوڈ کریں (.txt)" : "Download (.txt)"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              {isUrdu ? "بند کریں" : "Close"}
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} className="gap-1.5 shadow-sm">
              <Printer className="w-4 h-4" />
              <span>{isUrdu ? "پرنٹ / PDF محفوظ کریں" : "Print / Save PDF"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
