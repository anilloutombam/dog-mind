import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  text: z.string().trim().min(1).max(200),
});

const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Dog voice is not configured yet." }, { status: 503 });
    }

    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a short dog thought." }, { status: 400 });
    }

    const client = new ElevenLabsClient({ apiKey });
    const audio = await client.textToSpeech.convert(
      process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID,
      {
        text: parsed.data.text,
        modelId: "eleven_flash_v2_5",
        outputFormat: "mp3_44100_128",
        voiceSettings: {
          stability: 0.45,
          similarityBoost: 0.75,
          style: 0.35,
          useSpeakerBoost: true,
          speed: 1.05,
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
    console.error("Dog voice generation failed:", error);
    return NextResponse.json(
      { error: "We couldn’t give your dog a voice. Please try again." },
      { status: 500 },
    );
  }
}
