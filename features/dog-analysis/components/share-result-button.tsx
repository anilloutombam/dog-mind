"use client";

import { Download, Share2 } from "lucide-react";
import { useState } from "react";
import type { DogAnalysis } from "../types";

type Props = { analysis: DogAnalysis; previewUrl: string };
let shareIsActive = false;
let shareLockedUntil = 0;

export function ShareResultButton({ analysis, previewUrl }: Props) {
  const [busy, setBusy] = useState(false);

  async function createCard() {
    const now = Date.now();
    if (shareIsActive || now < shareLockedUntil) return;
    shareIsActive = true;
    setBusy(true);
    try {
      const image = new Image();
      image.src = previewUrl;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 1080; canvas.height = 1080;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");

      const gradient = context.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, "#071427"); gradient.addColorStop(1, "#17213a");
      context.fillStyle = gradient; context.fillRect(0, 0, 1080, 1080);
      context.fillStyle = "#ffca4e"; context.font = "800 42px system-ui"; context.fillText("🐾 Dog Mind", 70, 85);
      const size = 430; const scale = Math.min(size / image.width, size / image.height);
      const width = image.width * scale; const height = image.height * scale;
      context.drawImage(image, 540 - width / 2, 145 + (size - height) / 2, width, height);
      context.fillStyle = "#f4f5ff"; context.textAlign = "center"; context.font = "900 56px system-ui";
      context.fillText(analysis.mood, 540, 665);
      context.fillStyle = "#a9b0c4"; context.font = "500 25px system-ui";
      context.fillText(`Looks like ${analysis.breedGuess}`, 540, 715);
      context.fillStyle = "#8d82ff"; context.font = "700 23px system-ui";
      context.fillText("INNER MONOLOGUE", 540, 790);
      context.fillStyle = "#ffffff"; context.font = "600 31px system-ui";
      const words = `“${analysis.thought}”`.split(" "); let line = ""; let y = 845;
      for (const word of words) {
        const next = `${line}${word} `;
        if (context.measureText(next).width > 880) { context.fillText(line, 540, y); line = `${word} `; y += 44; } else line = next;
      }
      context.fillText(line, 540, y);
      context.fillStyle = "#737b91"; context.font = "500 20px system-ui"; context.fillText("dog-mind · for entertainment only", 540, 1020);

      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Export failed")), "image/png"));
      const file = new File([blob], "dog-mind-result.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ title: "My Dog Mind result", files: [file] });
      else { const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = file.name; link.click(); URL.revokeObjectURL(url); }
    } finally {
      shareIsActive = false;
      shareLockedUntil = Date.now() + 2_000;
      setBusy(false);
    }
  }

  return <button className="secondary-action" type="button" onClick={createCard} disabled={busy}>{busy ? <Download size={17} /> : <Share2 size={17} />}{busy ? "Creating card…" : "Share result"}</button>;
}
