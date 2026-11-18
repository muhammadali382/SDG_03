import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import { createWorker, type Worker } from "tesseract.js";

const execFileAsync = promisify(execFile);

const ALLOWED_SAMPLES: Record<string, string> = {
  "/demo-lab-report.png": "public/demo-lab-report.png",
  "/demo-prescription.png": "public/demo-prescription.png",
};

const globalForOcr = global as unknown as {
  ocrWorkerPromise?: Promise<Worker>;
};

async function getOcrWorker(): Promise<Worker> {
  if (!globalForOcr.ocrWorkerPromise) {
    const langPath = path.resolve(process.cwd(), "public/tessdata");
    globalForOcr.ocrWorkerPromise = createWorker("eng", 1, {
      langPath,
      cachePath: os.tmpdir(),
    }).catch((err) => {
      globalForOcr.ocrWorkerPromise = undefined;
      throw err;
    });
  }
  return globalForOcr.ocrWorkerPromise;
}

// Fast local image preprocessing (grayscale + contrast + gentle upscale for small images)
async function preprocessImageBuffer(inputBuf: Buffer): Promise<Buffer> {
  const tmpIn = path.join(os.tmpdir(), `tabeeb_ocr_in_${Date.now()}_${Math.random().toString(36).slice(2)}.img`);
  const tmpOut = path.join(os.tmpdir(), `tabeeb_ocr_out_${Date.now()}_${Math.random().toString(36).slice(2)}.png`);
  try {
    await fs.writeFile(tmpIn, inputBuf);
    await execFileAsync(
      "python3",
      [
        "-c",
        `
import sys
from PIL import Image, ImageOps, ImageEnhance
img = Image.open(sys.argv[1])
img = ImageOps.exif_transpose(img).convert("L")
w, h = img.size
if w < 1500:
    scale = min(2.0, 1500.0 / max(w, 1))
    img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
img = ImageOps.autocontrast(img)
img = ImageEnhance.Sharpness(img).enhance(1.6)
img.save(sys.argv[2], format="PNG")
`,
        tmpIn,
        tmpOut,
      ],
      { timeout: 6000 }
    );
    return await fs.readFile(tmpOut);
  } catch {
    return inputBuf;
  } finally {
    await fs.unlink(tmpIn).catch(() => {});
    await fs.unlink(tmpOut).catch(() => {});
  }
}

async function extractPdfText(pdfBuf: Buffer): Promise<string> {
  const tmpPdf = path.join(os.tmpdir(), `tabeeb_pdf_${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`);
  try {
    await fs.writeFile(tmpPdf, pdfBuf);
    const { stdout } = await execFileAsync("pdftotext", ["-layout", tmpPdf, "-"], {
      timeout: 6000,
    });
    return (stdout || "").trim();
  } finally {
    await fs.unlink(tmpPdf).catch(() => {});
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileInput = formData.get("file");
    const samplePath = formData.get("samplePath");

    let buffer: Buffer;
    let isPdf = false;

    if (typeof samplePath === "string" && ALLOWED_SAMPLES[samplePath]) {
      const fullPath = path.resolve(process.cwd(), ALLOWED_SAMPLES[samplePath]);
      buffer = await fs.readFile(fullPath);
    } else if (fileInput && fileInput instanceof Blob) {
      if (fileInput.size === 0) {
        return NextResponse.json({ error: "Uploaded file is empty" }, { status: 400 });
      }
      const mime = (fileInput.type || "").toLowerCase();
      const name = "name" in fileInput && typeof fileInput.name === "string" ? fileInput.name.toLowerCase() : "";
      isPdf = mime.includes("pdf") || name.endsWith(".pdf");
      buffer = Buffer.from(await fileInput.arrayBuffer());
    } else {
      return NextResponse.json(
        { error: "Please upload an image (PNG, JPG, WEBP) or PDF medical report" },
        { status: 400 }
      );
    }

    if (isPdf) {
      const text = await extractPdfText(buffer);
      return NextResponse.json({
        success: true,
        text,
        confidence: text ? 99 : 0,
        engine: "pdftotext",
      });
    }

    const processedBuffer = await preprocessImageBuffer(buffer);
    const worker = await getOcrWorker();
    const result = await worker.recognize(processedBuffer);

    const text = (result.data.text || "").trim();
    const confidence = Math.round(result.data.confidence || 0);

    return NextResponse.json({
      success: true,
      text,
      confidence,
      engine: "tesseract-local-node",
    });
  } catch (error: unknown) {
    console.error("Server OCR API error:", error);
    const msg =
      error instanceof Error ? error.message : "Failed to extract text from document";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
