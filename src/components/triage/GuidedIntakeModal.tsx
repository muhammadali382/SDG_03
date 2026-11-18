"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { VoiceButton } from "../ui/VoiceButton";
import { useUser } from "@/context/UserContext";

export interface IntakeAnswerItem {
  question: string;
  answer: string;
}

interface GuidedIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnswers: (answers: IntakeAnswerItem[]) => Promise<void>;
  isGenerating?: boolean;
  hasAttachedLabReport?: boolean;
}

const INTAKE_QUESTIONS = [
  {
    id: "complaint",
    questionEn: "What is your main symptom or health concern right now?",
    questionUr: "اس وقت آپ کی سب سے بڑی تکلیف یا بنیادی علامت کیا ہے؟",
    placeholderEn: "e.g., Persistent high fever with body aches and headache",
    placeholderUr: "مثال: دو دن سے تیز بخار، سر درد اور جسم میں شدید درد",
    quickChipsEn: ["High fever & chills", "Chest tightness / pain", "Severe headache & dizziness", "Stomach pain & vomiting"],
    quickChipsUr: ["تیز بخار اور سردی", "سینے میں دباؤ / درد", "شدید سر درد اور چکر", "پیٹ درد اور الٹی"],
  },
  {
    id: "duration",
    questionEn: "When did these symptoms start, and did they begin suddenly or gradually?",
    questionUr: "یہ علامات کب شروع ہوئیں، اور اچانک شروع ہوئیں یا آہستہ آہستہ؟",
    placeholderEn: "e.g., Started gradually 2 days ago and worsened last night",
    placeholderUr: "مثال: دو دن پہلے آہستہ آہستہ شروع ہوا اور کل رات بڑھ گیا",
    quickChipsEn: ["Started today (suddenly)", "2–3 days ago (gradual)", "About 1 week ago", "Recurring for weeks"],
    quickChipsUr: ["آج اچانک شروع ہوا", "2 سے 3 دن پہلے", "تقریباً ایک ہفتے سے", "کئی ہفتوں سے بار بار"],
  },
  {
    id: "severity",
    questionEn: "How severe is it (1 to 10), and what makes it better or worse?",
    questionUr: "تکلیف کی شدت کتنی ہے (1 سے 10 تک) اور کس چیز سے کم یا زیادہ ہوتی ہے؟",
    placeholderEn: "e.g., 7/10, gets worse at night and improves slightly with rest",
    placeholderUr: "مثال: شدت 7/10 ہے، رات کو بڑھ جاتی ہے اور آرام سے کچھ فرق پڑتا ہے",
    quickChipsEn: ["Mild (3/10) — manageable", "Moderate (6/10) — worse on exertion", "Severe (8/10) — disturbing sleep", "Gets worse after eating"],
    quickChipsUr: ["ہلکی (3/10) — قابلِ برداشت", "درمیانی (6/10) — چلنے سے بڑھتی ہے", "شدید (8/10) — نیند متاثر", "کھانے کے بعد بڑھ جاتی ہے"],
  },
  {
    id: "associated",
    questionEn: "Are you experiencing any associated symptoms or warning signs?",
    questionUr: "کیا اس کے ساتھ کوئی اور علامات یا خطرے کی نشانیاں بھی موجود ہیں؟",
    placeholderEn: "e.g., Nausea, weakness, no shortness of breath or skin rash",
    placeholderUr: "مثال: متلی اور کمزوری ہے، سانس لینے میں دشواری یا خارش نہیں ہے",
    quickChipsEn: ["Chills, sweating & fatigue", "Nausea / loss of appetite", "Shortness of breath / dizziness", "No other warning signs"],
    quickChipsUr: ["سردی، پسینہ اور کمزوری", "متلی اور بھوک کی کمی", "سانس پھولنا / چکر آنا", "کوئی اور خطرے کی علامت نہیں"],
  },
  {
    id: "meds_taken",
    questionEn: "Have you taken any medicines for this yet, or anything else the doctor should know?",
    questionUr: "کیا آپ نے اس کے لیے کوئی دوا لی ہے یا ڈاکٹر کو کچھ اور بتانا چاہتے ہیں؟",
    placeholderEn: "e.g., Took Panadol 500mg twice; blood sugar was 186 mg/dL this morning",
    placeholderUr: "مثال: پیناڈول 500mg دو بار لی؛ صبح شوگر 186 mg/dL تھی",
    quickChipsEn: ["Took Panadol 500mg only", "No medicines taken yet", "Blood pressure was high today", "Attached lab report values"],
    quickChipsUr: ["صرف پیناڈول 500mg لی ہے", "ابھی تک کوئی دوا نہیں لی", "آج بلڈ پریشر زیادہ تھا", "لیب رپورٹ منسلک کی ہے"],
  },
];

export function GuidedIntakeModal({
  isOpen,
  onClose,
  onSubmitAnswers,
  isGenerating = false,
  hasAttachedLabReport = false,
}: GuidedIntakeModalProps) {
  const { lang } = useUser();
  const isUrdu = lang === "ur";

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentQ = INTAKE_QUESTIONS[step];
  const answeredCount = answers.filter((a) => a.trim().length > 0).length;
  const progressPct = Math.round(((step + 1) / INTAKE_QUESTIONS.length) * 100);

  const updateCurrentAnswer = (val: string) => {
    setLocalError(null);
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = val;
      return next;
    });
  };

  const appendChip = (chipText: string) => {
    setLocalError(null);
    setAnswers((prev) => {
      const next = [...prev];
      const existing = next[step].trim();
      next[step] = existing ? `${existing}; ${chipText}` : chipText;
      return next;
    });
  };

  const handleNext = () => {
    if (!answers[step].trim()) {
      setLocalError(
        isUrdu
          ? "براہ کرم آگے بڑھنے کے لیے اس سوال کا جواب دیں"
          : "Please answer this question before continuing"
      );
      return;
    }
    setLocalError(null);
    if (step < INTAKE_QUESTIONS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleGenerate = async () => {
    if (answeredCount < 3) {
      setLocalError(
        isUrdu
          ? "مکمل ڈاکٹر رپورٹ کے لیے کم از کم 3 سوالات کے جوابات ضروری ہیں"
          : "Please answer at least 3 questions to generate a comprehensive doctor report"
      );
      return;
    }
    setLocalError(null);
    const payload: IntakeAnswerItem[] = INTAKE_QUESTIONS.map((q, idx) => ({
      question: q.questionEn,
      answer: answers[idx].trim(),
    })).filter((item) => item.answer.length > 0);

    await onSubmitAnswers(payload);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers(["", "", "", "", ""]);
    setLocalError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isUrdu
                  ? "ڈاکٹر رپورٹ انٹیک (5 سوالات)"
                  : "Guided Doctor Report Intake (5 Questions)"}
              </h3>
              <p className="text-xs text-slate-500">
                {isUrdu
                  ? "متعدد سوالات کے جوابات دیں تاکہ مکمل SBAR ڈاکٹر رپورٹ تیار ہو سکے"
                  : "Answer multiple clinical questions to synthesize one complete SBAR doctor handover report"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Step Indicators */}
        <div className="px-5 pt-4 pb-2 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>
              {isUrdu
                ? `سوال ${step + 1} از ${INTAKE_QUESTIONS.length}`
                : `Question ${step + 1} of ${INTAKE_QUESTIONS.length}`}
            </span>
            <span className="text-teal-700">
              {isUrdu
                ? `${answeredCount} جوابات مکمل`
                : `${answeredCount}/${INTAKE_QUESTIONS.length} answered`}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-1.5 pt-1">
            {INTAKE_QUESTIONS.map((q, idx) => {
              const filled = answers[idx].trim().length > 0;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setStep(idx)}
                  disabled={isGenerating}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                    idx === step
                      ? "bg-teal-600 text-white border-teal-600"
                      : filled
                      ? "bg-teal-50 text-teal-800 border-teal-200"
                      : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Q{idx + 1} {filled ? "✓" : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Body */}
        <div
          dir={isUrdu ? "rtl" : "ltr"}
          className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1"
        >
          {hasAttachedLabReport && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isUrdu
                  ? "آپ کی اپ لوڈ کردہ لیب رپورٹ اس ڈاکٹر رپورٹ میں خودکار طور پر شامل ہوگی۔"
                  : "Your uploaded lab report findings will automatically be included in this doctor report."}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm sm:text-base font-extrabold text-slate-900 block leading-snug">
              {isUrdu ? currentQ.questionUr : currentQ.questionEn}
            </label>
            <p className="text-xs text-slate-500">
              {isUrdu ? currentQ.questionEn : currentQ.questionUr}
            </p>
          </div>

          {/* Quick-Fill Chips */}
          <div className="flex flex-wrap gap-2">
            {(isUrdu ? currentQ.quickChipsUr : currentQ.quickChipsEn).map(
              (chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => appendChip(chip)}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-medium text-slate-700 hover:text-teal-800 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
                  <span>{chip}</span>
                </button>
              )
            )}
          </div>

          {/* Textarea + Voice Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {isUrdu ? "لکھیں یا مائیک سے بولیں" : "Type or dictate your answer"}
              </span>
              <VoiceButton
                onTranscript={(spoken) => {
                  updateCurrentAnswer(
                    answers[step].trim()
                      ? `${answers[step].trim()} ${spoken}`
                      : spoken
                  );
                }}
                defaultLang={isUrdu ? "ur-PK" : "en-US"}
              />
            </div>
            <textarea
              rows={3}
              value={answers[step]}
              onChange={(e) => updateCurrentAnswer(e.target.value)}
              disabled={isGenerating}
              placeholder={isUrdu ? currentQ.placeholderUr : currentQ.placeholderEn}
              className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
            />
          </div>

          {localError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
              {localError}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0 || isGenerating}
              className="gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isUrdu ? "پیچھے" : "Back"}</span>
            </Button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isGenerating}
              className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 font-medium"
            >
              {isUrdu ? "صاف کریں" : "Clear"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {step < INTAKE_QUESTIONS.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={isGenerating}
                className="gap-1.5"
              >
                <span>{isUrdu ? "اگلا سوال" : "Next Question"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating || answeredCount < 3}
                className="gap-1.5 shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isUrdu ? "رپورٹ تیار ہو رہی ہے..." : "Generating Report..."}</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>{isUrdu ? "مکمل ڈاکٹر رپورٹ بنائیں" : "Generate Full Doctor Report"}</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
