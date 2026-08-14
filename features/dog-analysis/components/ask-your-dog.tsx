"use client";

import { MessageCircle, RotateCcw, Send } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import type { DogAnalysis } from "../types";
import { VoicePlayer } from "./voice-player";

const suggestions = ["Do you want a walk?", "Who is your favorite human?", "Why are you staring at me?"];
const QUESTION_LIMIT = 3;

export function AskYourDog({ analysis }: { analysis: DogAnalysis }) {
  const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  async function ask(event: FormEvent) {
    event.preventDefault(); if (!question.trim() || loading || questionsAsked >= QUESTION_LIMIT) return;
    setLoading(true); setError(""); setAnswer("");
    try {
      const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, dog: { breedGuess: analysis.breedGuess, mood: analysis.mood, thought: analysis.thought } }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Dog chat failed."); setAnswer(data.answer); setQuestionsAsked((count) => count + 1); setQuestion("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Dog chat failed."); } finally { setLoading(false); }
  }
  const remaining = QUESTION_LIMIT - questionsAsked;
  return <section className="ask-dog"><header><MessageCircle size={18} /><div><strong>Ask your dog</strong><span>{remaining > 0 ? `${remaining} question${remaining === 1 ? "" : "s"} remaining` : "Question limit reached"}</span></div></header>
    {remaining > 0 && <><div className="question-chips">{suggestions.map((item) => <button type="button" key={item} onClick={() => setQuestion(item)}>{item}</button>)}</div>
    <form ref={formRef} onSubmit={ask}><input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={160} placeholder="Ask one very important dog question…" aria-label="Question for your dog"/><button disabled={loading || !question.trim()} aria-label="Ask question"><Send size={17}/></button></form></>}
    {loading && <p className="dog-reply loading-reply">Consulting the pup…</p>}{error && <div className="inline-error" role="alert"><p className="voice-error">{error}</p><button type="button" className="voice-retry" onClick={() => formRef.current?.requestSubmit()}><RotateCcw size={14}/> Try again</button></div>}
    {answer && <div className="dog-answer"><p>“{answer}”</p><VoicePlayer text={answer} voiceStyle={analysis.voiceStyle} breedGuess={analysis.breedGuess}/></div>}
  </section>;
}
