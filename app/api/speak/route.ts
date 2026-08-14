import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { VOICE_STYLES, type VoiceStyle } from "@/features/dog-analysis/types";
import { enforceRateLimit, requestId, safeApiError } from "@/lib/server/api-guard";

const requestSchema = z.object({
  text: z.string().trim().min(1).max(200),
  voiceStyle: z.enum(VOICE_STYLES),
});

const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

const VOICE_PRESETS: Record<VoiceStyle, { stability: number; style: number; speed: number }> = {
  bright: { stability: 0.34, style: 0.58, speed: 1.14 },
  warm: { stability: 0.55, style: 0.3, speed: 1.0 },
  bold: { stability: 0.62, style: 0.46, speed: 0.94 },
  dramatic: { stability: 0.38, style: 0.72, speed: 1.02 },
  gentle: { stability: 0.7, style: 0.2, speed: 0.9 },
  gruff: { stability: 0.58, style: 0.54, speed: 0.86 },
};

export async function POST(request: Request) {
  const id = requestId();
  try {
    const rateLimited = enforceRateLimit(request, "speak", 12);
    if (rateLimited) return rateLimited;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Dog voice is not configured yet." }, { status: 503 });
    }

    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a short dog thought." }, { status: 400 });
    }

    const client = new ElevenLabsClient({ apiKey, timeoutInSeconds: 20 });
    const preset = VOICE_PRESETS[parsed.data.voiceStyle];
    const audio = await client.textToSpeech.convert(
      process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID,
      {
        text: parsed.data.text,
        modelId: "eleven_flash_v2_5",
        outputFormat: "mp3_44100_128",
        voiceSettings: {
          stability: preset.stability,
          similarityBoost: 0.75,
          style: preset.style,
          useSpeakerBoost: true,
          speed: preset.speed,
        },
      },
    );

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Dog voice generation failed", { requestId: id, error });
    return safeApiError("We couldn’t give your dog a voice. Please try again.", id);
  }
}
