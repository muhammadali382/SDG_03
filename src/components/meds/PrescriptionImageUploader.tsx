"use client";

import React, { useState, useRef } from "react";
import { Camera, Upload, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { extractTextFromImage } from "@/lib/ocr/client_ocr";

interface PrescriptionImageUploaderProps {
  isUrdu?: boolean;
  onExtractedText: (text: string) => void;
}

export function PrescriptionImageUploader({
  isUrdu = false,
  onExtractedText,
}: PrescriptionImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanDone, setScanDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runPrescriptionOcr = async (source: File | string, displayUrl: string) => {
    setError(null);
    setScanDone(false);
    setPreviewUrl(displayUrl);
    setIsScanning(true);
    setProgress(8);

    try {
      const res = await extractTextFromImage(source, (pct) => setProgress(pct));
      if (!res.text) {
        setError(
          isUrdu
            ? "تصویر سے دواؤں کے نام واضح نہ پڑھے جا سکے، براہ کرم نیچے لکھیں"
            : "Could not read clear text from this image. Try a clearer printed photo or type below."
        );
      } else {
        onExtractedText(res.text);
        setScanDone(true);
      }
    } catch (err) {
      console.error("Prescription OCR error:", err);
      setError(
        isUrdu
          ? "تصویر اسکین کرنے میں مسئلہ آیا"
          : "Image OCR failed. Please try another PNG/JPG photo."
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    void runPrescriptionOcr(file, url);
  };

  return (
    <div className="p-3.5 rounded-2xl border border-dashed border-teal-300 bg-teal-50/40 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
          <Camera className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            {isUrdu ? "نسخے کی تصویر اسکین کریں (OCR)" : "Scan Printed Prescription Photo (OCR)"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-2xs transition-colors disabled:opacity-50"
          >
            <Upload className="w-3 h-3" />
            <span>{isUrdu ? "تصویر اپ لوڈ" : "Upload Photo"}</span>
          </button>
          <button
            type="button"
            onClick={() => void runPrescriptionOcr("/demo-prescription.png", "/demo-prescription.png")}
            disabled={isScanning}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-teal-300 hover:bg-teal-50 text-teal-800 text-[11px] font-bold shadow-2xs transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>{isUrdu ? "نمونہ نسخہ" : "Demo Rx Image"}</span>
          </button>
        </div>
      </div>

      {isScanning && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-teal-800">
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
              {isUrdu ? "تصویر سے ادویات پڑھی جا رہی ہیں..." : "Extracting medicines with local OCR..."}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-teal-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {previewUrl && !isScanning && (
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200">
          <img
            src={previewUrl}
            alt="Prescription preview"
            className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
          />
          <div className="text-[11px] flex-1">
            {scanDone ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {isUrdu
                  ? "متن نیچے باکس میں شامل کر دیا گیا! اب تجزیہ پر کلک کریں۔"
                  : "Text extracted into the box below! Review and click Analyze."}
              </span>
            ) : error ? (
              <span className="text-red-700 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                {error}
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
