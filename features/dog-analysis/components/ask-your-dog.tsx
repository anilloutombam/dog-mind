"use client";

import { MessageCircle, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import type { DogAnalysis } from "../types";
import { VoicePlayer } from "./voice-player";

const suggestions = ["Do you want a walk?", "Who is your favorite human?", "Why are you staring at me?"];

export function AskYourDog({ analysis }: { analysis: DogAnalysis }) {
  const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function ask(event: FormEvent) {
    event.preventDefault(); if (!question.trim() || loading) return;
    setLoading(true); setError(""); setAnswer("");
    try {
      const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, dog: { breedGuess: analysis.breedGuess, mood: analysis.mood, thought: analysis.thought } }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Dog chat failed."); setAnswer(data.answer);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Dog chat failed."); } finally { setLoading(false); }
  }
  return <section className="ask-dog"><header><MessageCircle size={18} /><div><strong>Ask your dog</strong><span>Continue the imaginary conversation</span></div></header>
    <div className="question-chips">{suggestions.map((item) => <button type="button" key={item} onClick={() => setQuestion(item)}>{item}</button>)}</div>
    <form onSubmit={ask}><input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={160} placeholder="Ask one very important dog question…" aria-label="Question for your dog"/><button disabled={loading || !question.trim()} aria-label="Ask question"><Send size={17}/></button></form>
    {loading && <p className="dog-reply loading-reply">Consulting the pup…</p>}{error && <p className="voice-error" role="alert">{error}</p>}
    {answer && <div className="dog-answer"><p>“{answer}”</p><VoicePlayer text={answer} voiceStyle={analysis.voiceStyle} breedGuess={analysis.breedGuess}/></div>}
  </section>;
}
