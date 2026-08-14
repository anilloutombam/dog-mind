import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { VOICE_STYLES } from "@/features/dog-analysis/types";
import { enforceRateLimit, geminiRateLimitResponse, requestId, safeApiError } from "@/lib/server/api-guard";
import { ACCEPTED_SERVER_IMAGE_TYPES, hasValidImageSignature } from "@/lib/server/image-validation";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const analysisSchema = z.object({
  isDog: z.boolean(),
  breedGuess: z.string().trim().min(1).max(60),
  breedConfidence: z.number().int().min(0).max(100),
  dogSize: z.enum(["small", "medium", "large", "unknown"]),
  voiceStyle: z.enum(VOICE_STYLES),
  mood: z.string(),
  confidence: z.number().min(0).max(100),
  signals: z.object({
    happiness: z.number().min(0).max(100),
    energy: z.number().min(0).max(100),
    mischief: z.number().min(0).max(100),
  }),
  observations: z.array(z.string()).max(5),
  thought: z.string(),
  summary: z.string(),
});

export async function POST(request: Request) {
  const id = requestId();
  try {
    const rateLimited = enforceRateLimit(request, "analyze", 8);
    if (rateLimited) return rateLimited;
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please provide an image." },
        { status: 400 }
      );
    }

    if (!ACCEPTED_SERVER_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG and WebP images are supported." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be smaller than 5 MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    if (!hasValidImageSignature(file.type, new Uint8Array(bytes))) {
      return NextResponse.json({ error: "That file does not appear to be a valid image." }, { status: 400 });
    }
    const base64 = Buffer.from(bytes).toString("base64");

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64,
              },
            },
            {
              text: `
Analyze the provided image.

First determine whether the primary subject is a dog.

If it is a dog, interpret only clearly visible body-language
signals. Do not make medical or veterinary claims.

Make a cautious visual breed guess. Use "Mixed or unknown" when the
image is ambiguous. Choose one voice style inspired by the dog's
visible size, expression, and energy—not as a scientific claim:
bright, warm, bold, dramatic, gentle, or gruff.

Also create a short, funny, family-friendly imaginary inner
monologue for the dog.

Return JSON with:
- isDog: boolean
- breedGuess: short likely breed/type, or "Mixed or unknown"
- breedConfidence: integer 0-100 (0 when the subject is not a dog)
- dogSize: "small", "medium", "large", or "unknown"
- voiceStyle: "bright", "warm", "bold", "dramatic", "gentle", or "gruff"
- mood: string
- confidence: integer 0-100
- signals:
  - happiness: integer 0-100
  - energy: integer 0-100
  - mischief: integer 0-100
- observations: maximum 5 short strings
- thought: maximum 160 characters
- summary: maximum 200 characters
              `,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        abortSignal: AbortSignal.timeout(25_000),
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response");
    }

    const parsed = analysisSchema.parse(JSON.parse(response.text));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Dog analysis failed", { requestId: id, error });
    const rateLimited = geminiRateLimitResponse(error);
    if (rateLimited) return rateLimited;
    return safeApiError("We couldn't analyze this image. Please try again.", id);
  }
}
