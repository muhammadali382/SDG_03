"use client";

import React from "react";
import { Pill, Sun, Sunrise, Sunset, Moon, AlertTriangle, ShieldCheck, Utensils, AlertCircle, MapPin } from "lucide-react";
import clsx from "clsx";
import { AudioReadoutButton } from "../ui/AudioReadoutButton";

export interface MedicineData {
  name: string;
  generic: string;
  purpose: string;
  purpose_urdu: string;
  schedule: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  food_instruction: string;
  food_instruction_urdu: string;
  warnings?: string[];
  allergy_conflict?: boolean;
  allergy_message?: string | null;
}

interface MedicineCardProps {
  med: MedicineData;
  lang?: "en" | "ur";
}

export function MedicineCard({ med, lang = "en" }: MedicineCardProps) {
  const isUrdu = lang === "ur";

  const scheduleSlots = [
    { key: "morning", label: "Morning", labelUrdu: "صبح", icon: Sunrise, active: med.schedule?.morning },
    { key: "afternoon", label: "Afternoon", labelUrdu: "دوپہر", icon: Sun, active: med.schedule?.afternoon },
    { key: "evening", label: "Evening", labelUrdu: "شام", icon: Sunset, active: med.schedule?.evening },
    { key: "night", label: "Night", labelUrdu: "رات", icon: Moon, active: med.schedule?.night },
  ];

  const activeTimes = scheduleSlots
    .filter((s) => s.active)
    .map((s) => (isUrdu ? s.labelUrdu : s.label))
    .join(", ");

  const readoutText = isUrdu
    ? `${med.name}. ${med.purpose_urdu || med.purpose}. ${activeTimes ? `اوقات: ${activeTimes}.` : ""} ${med.food_instruction_urdu || med.food_instruction || ""} ${med.allergy_conflict && med.allergy_message ? `الرجی کا خطرہ: ${med.allergy_message}` : ""}`.trim()
    : `${med.name}. ${med.purpose}. ${activeTimes ? `Schedule: ${activeTimes}.` : ""} ${med.food_instruction || ""} ${med.allergy_conflict && med.allergy_message ? `Allergy warning: ${med.allergy_message}` : ""}`.trim();

  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border shadow-sm p-4 sm:p-6 space-y-4 transition-all font-sans",
        med.allergy_conflict
          ? "border-red-300 ring-2 ring-red-100 bg-red-50/10"
          : "border-slate-200 hover:border-teal-300 hover:shadow-md"
      )}
    >
      {/* Allergy Conflict Warning Banner */}
      {med.allergy_conflict && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 text-red-900 animate-in fade-in duration-300">
          <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1 text-xs sm:text-sm">
            <strong className="font-extrabold text-red-900 block tracking-tight">
              🚨 ALLERGY CONFLICT WARNING (الرجی کا خطرہ)
            </strong>
            <p className="leading-relaxed text-red-800">
              {med.allergy_message ||
                "This medication conflicts with your recorded health profile allergies. Do not take without consulting your physician."}
            </p>
          </div>
        </div>
      )}

      {/* Header: Medication Name, Generic, & Clinical Purpose */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={clsx(
              "w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs",
              med.allergy_conflict
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-teal-50 text-teal-700 border border-teal-200"
            )}
          >
            <Pill className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {med.name}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              <span className="font-semibold text-slate-600">Generic:</span> {med.generic || "Active Ingredient"}
            </p>
          </div>
        </div>

        {/* Clinical Purpose Badge */}
        <div className="self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50/90 border border-teal-200/90 px-3 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{isUrdu && med.purpose_urdu ? med.purpose_urdu : med.purpose}</span>
          </span>
        </div>
      </div>

      {/* 24-Hour Routine Schedule */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>{isUrdu ? "روزانہ کی خوراک کا وقت" : "24-Hour Routine Schedule"}</span>
          <span className="text-[11px] font-normal normal-case text-slate-400">
            {isUrdu ? "سبز رنگ مطلوبہ وقت کو ظاہر کرتا ہے" : "Highlighted slots indicate prescribed doses"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {scheduleSlots.map(({ key, label, labelUrdu, icon: Icon, active }) => (
            <div
              key={key}
              className={clsx(
                "flex items-center gap-2.5 p-3 rounded-xl border text-xs transition-all",
                active
                  ? "bg-teal-50/90 border-teal-400 text-teal-900 shadow-xs font-bold"
                  : "bg-slate-50/60 border-slate-200 text-slate-400 opacity-60"
              )}
            >
              <div
                className={clsx(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                  active ? "bg-teal-600 text-white shadow-2xs" : "bg-slate-200/70 text-slate-400"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold">{isUrdu ? labelUrdu : label}</span>
                <span className="text-[10px] font-medium opacity-80">
                  {active ? (isUrdu ? "دوا لیں" : "Take Dose") : (isUrdu ? "نہیں لینا" : "Skip")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Intake & Safety Precautions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Food Instructions */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Utensils className="w-4 h-4 text-teal-600" />
            <span>{isUrdu ? "کھانے کے ساتھ ہدایات" : "Food & Diet Instruction"}</span>
          </div>
          <p className="leading-relaxed">
            {isUrdu && med.food_instruction_urdu
              ? med.food_instruction_urdu
              : med.food_instruction || "Take as directed by doctor."}
          </p>
        </div>

        {/* Warnings & Precautions */}
        {med.warnings && med.warnings.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{isUrdu ? "اہم احتیاطی تدابیر" : "Precautions & Safety"}</span>
            </div>
            <ul className="space-y-1 list-disc list-inside leading-relaxed text-amber-800">
              {med.warnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Card Footer: Audio Readout & Nearest Pharmacy Link */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <AudioReadoutButton text={readoutText} />
        <a
          href="https://www.google.com/maps/search/pharmacy+near+me"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 text-slate-700 hover:text-teal-800 text-xs font-semibold transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>{isUrdu ? "قریبی فارمیسی تلاش کریں" : "Find at Nearest Pharmacy"}</span>
        </a>
      </div>
    </div>
  );
}
