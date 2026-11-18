"use client";

export interface OcrResult {
  text: string;
  confidence: number;
  engine?: string;
}

export async function extractTextFromImage(
  imageSource: File | Blob | string,
  onProgress?: (percent: number, status: string) => void
): Promise<OcrResult> {
  onProgress?.(20, "Uploading document to local OCR...");

  const formData = new FormData();
  if (typeof imageSource === "string") {
    formData.append("samplePath", imageSource);
  } else {
    const filename = "name" in imageSource && imageSource.name ? imageSource.name : "report.png";
    formData.append("file", imageSource, filename);
  }

  // Smooth visual progress while server runs fast local OCR
  let currentPct = 25;
  const ticker = setInterval(() => {
    currentPct = Math.min(90, currentPct + 12);
    onProgress?.(currentPct, "Extracting medical text locally...");
  }, 220);

  try {
    const res = await fetch("/api/ocr", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "OCR extraction failed");
    }

    onProgress?.(100, "Text extracted");
    return {
      text: (data.text || "").trim(),
      confidence: typeof data.confidence === "number" ? data.confidence : 0,
      engine: data.engine,
    };
  } finally {
    clearInterval(ticker);
  }
}
