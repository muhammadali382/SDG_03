import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";

const WHISPER_MODEL = "whisper-large-v3-turbo";

function getExtensionForMime(mimeType: string): string {
  const lower = mimeType.toLowerCase();
  if (lower.includes("ogg")) return "ogg";
  if (lower.includes("mp4") || lower.includes("m4a")) return "m4a";
  if (lower.includes("wav")) return "wav";
  if (lower.includes("mpeg") || lower.includes("mp3")) return "mp3";
  return "webm";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioInput = formData.get("file");
    const langRaw = formData.get("lang");

    if (!audioInput || !(audioInput instanceof Blob)) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    if (audioInput.size === 0) {
      return NextResponse.json(
        { error: "Recorded audio is empty" },
        { status: 400 }
      );
    }

    const mimeType = audioInput.type || "audio/webm";
    const ext = getExtensionForMime(mimeType);
    const arrayBuffer = await audioInput.arrayBuffer();
    const file = new File([arrayBuffer], `recording.${ext}`, { type: mimeType });

    let language: string | undefined;
    if (typeof langRaw === "string" && langRaw.trim()) {
      const normalized = langRaw.trim().toLowerCase();
      if (normalized.startsWith("ur")) {
        language = "ur";
      } else if (normalized.startsWith("en")) {
        language = "en";
      }
    }

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: WHISPER_MODEL,
      ...(language ? { language } : {}),
      prompt:
        "Medical symptoms, Pakistani medicine names like Panadol, Augmentin, Metformin, Glucophage, Urdu and English health consultation.",
      response_format: "json",
      temperature: 0,
    });

    const text = (transcription.text || "").trim();

    return NextResponse.json({
      success: true,
      text,
      model: WHISPER_MODEL,
    });
  } catch (error: unknown) {
    console.error("Transcribe API error:", error);
    const msg =
      error instanceof Error ? error.message : "Failed to transcribe audio";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
