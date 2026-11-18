"use client";

export interface OcrResult {
  text: string;
  confidence: number;
}

export async function extractTextFromImage(
  imageSource: File | Blob | string,
  onProgress?: (percent: number, status: string) => void
): Promise<OcrResult> {
  const { createWorker } = await import("tesseract.js");

  onProgress?.(10, "Initializing OCR engine...");

  const worker = await createWorker("eng", 1, {
    langPath: "/tessdata",
    logger: (m) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        const pct = Math.min(98, Math.max(20, Math.round(20 + m.progress * 78)));
        onProgress?.(pct, "Reading medical text...");
      } else if (m.status) {
        onProgress?.(18, "Loading OCR model...");
      }
    },
  });

  try {
    const result = await worker.recognize(imageSource);
    onProgress?.(100, "Text extracted");
    return {
      text: (result.data.text || "").trim(),
      confidence: Math.round(result.data.confidence || 0),
    };
  } finally {
    await worker.terminate();
  }
}
