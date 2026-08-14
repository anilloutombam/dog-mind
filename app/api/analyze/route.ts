import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const analysisSchema = z.object({
  isDog: z.boolean(),
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
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please provide an image." },
        { status: 400 }
      );
    }

    if (!allowedTypes.has(file.type)) {
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
    const base64 = Buffer.from(bytes).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

Also create a short, funny, family-friendly imaginary inner
monologue for the dog.

Return JSON with:
- isDog: boolean
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
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response");
    }

    const parsed = analysisSchema.parse(JSON.parse(response.text));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Dog analysis failed:", error);

    return NextResponse.json(
      { error: "We couldn't analyze this image. Please try again." },
      { status: 500 }
    );
  }
}