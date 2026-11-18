"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MedicineCard, MedicineData } from "@/components/meds/MedicineCard";
import { PrescriptionImageUploader } from "@/components/meds/PrescriptionImageUploader";
import { MedicalDisclaimerModal } from "@/components/layout/MedicalDisclaimer";
import { VoiceButton } from "@/components/ui/VoiceButton";
import {
  Pill,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Search,
  Clock,
  Info,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function MedsPage() {
  const router = useRouter();
  const { user, profile, isLoading: isUserLoading, lang, t } = useUser();
  const isUrdu = lang === "ur";

  const [inputMeds, setInputMeds] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medData, setMedData] = useState<{
    medications: MedicineData[];
    general_advice?: string;
    general_advice_urdu?: string;
  } | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const presets = [
    {
      title: "Diabetes Prescription",
      titleUrdu: "شوگر کا نسخہ",
      value: "Metformin 500mg, Glibenclamide 5mg, Aspirin 75mg",
    },
    {
      title: "Antibiotic Course",
      titleUrdu: "اینٹی بائیوٹک نسخہ (الرجی ٹیسٹ)",
      value: "Augmentin 625mg, Panadol 500mg",
      highlight: true,
    },
    {
      title: "Blood Pressure",
      titleUrdu: "بلڈ پریشر کا نسخہ",
      value: "Amlodipine 5mg, Losartan 50mg, Hydrochlorothiazide 25mg",
    },
  ];

  const handlePreset = (val: string) => {
    setInputMeds(val);
    handleAnalyze(val);
  };

  const handleAnalyze = async (medsToTest?: string) => {
    const text = medsToTest || inputMeds;
    if (!text.trim()) {
      setError(isUrdu ? "براہ کرم کم از کم ایک دوا کا نام درج کریں" : "Please enter at least one medication name");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/meds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medications: text,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.data) {
        setMedData(data.data);
      } else {
        setError(data.error || (isUrdu ? "تجزیہ مکمل نہ ہو سکا" : "Failed to analyze medications"));
      }
    } catch {
      setError(
        isUrdu
          ? "سرور سے رابطہ قائم نہ ہو سکا، براہ کرم دوبارہ کوشش کریں"
          : "Network error while connecting to Groq medication parser"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span>{isUrdu ? "لوڈ ہو رہا ہے..." : "Loading prescription scanner..."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 py-2">
      <MedicalDisclaimerModal featureKey="meds" />

      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/90 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t("meds_title")}
            </h1>
            <p className="text-xs text-teal-700 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Real-time Allergy Cross-Referencing & Visual Dosing Schedule
            </p>
          </div>
        </div>
      </div>

      {/* Full Width Grid Layout: Left Scanner Form + Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 p-5 sm:p-6 border-b border-slate-100">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold text-slate-800">
                  {t("meds_input_label")}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {isUrdu
                    ? "نسخے سے دواؤں کے نام لکھیں یا نیچے دیے گئے نمونے پر کلک کریں"
                    : "Enter medication names and strengths, or click a quick-fill test preset."}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-5">
              {/* Quick Presets */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  {t("meds_presets_label")}
                </span>
                <div className="flex flex-col gap-2">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePreset(preset.value)}
                      className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800 transition-all shadow-2xs text-left group active:scale-98"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 shrink-0" />
                        <span>{isUrdu ? preset.titleUrdu : preset.title}</span>
                      </div>
                      {preset.highlight && (
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-200">
                          Allergy Check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Printed Prescription Photo OCR Uploader */}
              <PrescriptionImageUploader
                isUrdu={isUrdu}
                onExtractedText={(text) => {
                  setInputMeds(text);
                }}
              />

              {/* Textarea Input with Voice Dictation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-600">
                    {isUrdu ? "دواؤں کے نام لکھیں یا بولیں" : "Type or speak medicine names"}
                  </span>
                  <VoiceButton
                    onTranscript={(spoken) => {
                      setInputMeds((prev) => (prev ? `${prev}, ${spoken}` : spoken));
                    }}
                    defaultLang={isUrdu ? "ur-PK" : "en-US"}
                  />
                </div>
                <textarea
                  rows={4}
                  value={inputMeds}
                  onChange={(e) => setInputMeds(e.target.value)}
                  placeholder={t("meds_input_placeholder")}
                  className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors leading-relaxed"
                />
              </div>

              {/* Action Button */}
              <Button
                onClick={() => handleAnalyze()}
                isLoading={isLoading}
                size="lg"
                className="w-full font-bold gap-2 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>{isLoading ? t("meds_btn_analyzing") : t("meds_btn_analyze")}</span>
              </Button>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Allergy Guardrail Context Notice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/90 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isUrdu ? "طبیب کیئر الرجی سیفٹی گارڈریل" : "TabeebCare Allergy Safety Guardrail"}</span>
            </div>
            <p className="leading-relaxed text-amber-800">
              {isUrdu
                ? `آپ کی محفوظ شدہ الرجیز (${profile?.allergies?.join(", ") || "کوئی نہیں"}) کی بنیاد پر ہر نسخے کی خودکار جانچ کی جاتی ہے۔`
                : `Active Profile Cross-Check: Cross-referencing against your recorded allergies (${profile?.allergies?.join(", ") || "None reported"}) to prevent contraindicated dispensing.`}
            </p>
          </div>
        </div>

        {/* Right Column (7 Cols on Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {medData ? (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {t("meds_results_title")}
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {medData.medications.length} {isUrdu ? "ادویات" : "Medication(s)"}
                </span>
              </div>

              {/* Medications Cards Stack */}
              <div className="space-y-5">
                {medData.medications.map((med, idx) => (
                  <MedicineCard key={idx} med={med} lang={lang} />
                ))}
              </div>

              {/* General Physician Advice */}
              {medData.general_advice && (
                <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Info className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>{isUrdu ? "عمومی طبی مشورہ و ہدایات" : "Clinical Pharmacist Guidance"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-teal-950 leading-relaxed">
                    {isUrdu && medData.general_advice_urdu
                      ? medData.general_advice_urdu
                      : medData.general_advice}
                  </p>
                </div>
              )}
            </section>
          ) : (
            /* Placeholder state before analysis */
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Pill className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-slate-700">
                  {isUrdu ? "کوئی نسخہ ابھی اسکین نہیں ہوا" : "No Prescription Analyzed Yet"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isUrdu
                    ? "بائیں جانب دواؤں کے نام درج کر کے تجزیہ کریں بٹن دبائیں تاکہ روزانہ کا شیڈول اور الرجی الرٹس ظاہر ہوں۔"
                    : "Enter medications on the left or select a quick-fill preset to view the 24-hr visual schedule, food precautions, and allergy conflict alerts."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
