"use client";

import { MessageCircle, RotateCcw, Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { DogAnalysis } from "../types";
import { VoicePlayer } from "./voice-player";

const suggestions = ["Do you want a walk?", "Who is your favorite human?", "Why are you staring at me?"];
const QUESTION_LIMIT = 3;

function conversationStorageKey(analysis: DogAnalysis) {
  return `dog-mind:conversation:${analysis.breedGuess}:${analysis.mood}:${analysis.thought}`;
}

function countStorageKey(analysis: DogAnalysis) {
  return `${conversationStorageKey(analysis)}:count`;
}

export function AskYourDog({ analysis }: { analysis: DogAnalysis }) {
  const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [retryAfter, setRetryAfter] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const conversationIdRef = useRef("");
  useEffect(() => {
    const storageKey = conversationStorageKey(analysis);
    const storedCountKey = countStorageKey(analysis);
    let hydrationTimer = 0;
    try {
      const existing = window.localStorage.getItem(storageKey);
      const id = existing ?? crypto.randomUUID();
      if (!existing) window.localStorage.setItem(storageKey, id);
      conversationIdRef.current = id;
      const storedCount = Number.parseInt(window.localStorage.getItem(storedCountKey) ?? "0", 10);
      hydrationTimer = window.setTimeout(() => setQuestionsAsked(Math.min(QUESTION_LIMIT, Math.max(0, storedCount || 0))), 0);
    } catch {
      conversationIdRef.current = crypto.randomUUID();
    }
    function syncCount(event: StorageEvent) {
      if (event.key !== storedCountKey) return;
      const nextCount = Number.parseInt(event.newValue ?? "0", 10);
      setQuestionsAsked(Math.min(QUESTION_LIMIT, Math.max(0, nextCount || 0)));
    }
    window.addEventListener("storage", syncCount);
    return () => {
      window.clearTimeout(hydrationTimer);
      window.removeEventListener("storage", syncCount);
    };
  }, [analysis]);
  useEffect(() => {
    if (retryAfter <= 0) return;
    const timer = window.setInterval(() => setRetryAfter((seconds) => Math.max(0, seconds - 1)), 1_000);
    return () => window.clearInterval(timer);
  }, [retryAfter]);
  async function ask(event: FormEvent) {
    event.preventDefault(); if (!question.trim() || !conversationIdRef.current || loading || retryAfter > 0 || questionsAsked >= QUESTION_LIMIT) return;
    setLoading(true); setError(""); setAnswer("");
    try {
      const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, conversationId: conversationIdRef.current, dog: { breedGuess: analysis.breedGuess, mood: analysis.mood, thought: analysis.thought } }) });
      const data = await response.json();
      if (!response.ok) {
        if (data.code === "QUESTION_LIMIT_REACHED") {
          setQuestionsAsked(QUESTION_LIMIT);
          setRetryAfter(0);
          setError(data.error || "This pup has answered all three questions.");
          try { window.localStorage.setItem(countStorageKey(analysis), String(QUESTION_LIMIT)); } catch {}
          return;
        }
        const headerDelay = Number.parseInt(response.headers.get("Retry-After") ?? "", 10);
        const bodyDelay = typeof data.retryAfter === "number" ? Math.ceil(data.retryAfter) : 0;
        setRetryAfter(Math.max(0, bodyDelay, Number.isFinite(headerDelay) ? headerDelay : 0));
        throw new Error(data.error || "Dog chat failed.");
      }
      setRetryAfter(0); setAnswer(data.answer); setQuestionsAsked((count) => {
        const nextCount = Math.min(QUESTION_LIMIT, count + 1);
        try { window.localStorage.setItem(countStorageKey(analysis), String(nextCount)); } catch {}
        return nextCount;
      }); setQuestion("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Dog chat failed."); } finally { setLoading(false); }
  }
  const remaining = QUESTION_LIMIT - questionsAsked;
  return <section className="ask-dog"><header><MessageCircle size={18} /><div><strong>Ask your dog</strong><span>{remaining > 0 ? `${remaining} question${remaining === 1 ? "" : "s"} remaining` : "Question limit reached"}</span></div></header>
    {remaining > 0 && <><div className="question-chips">{suggestions.map((item) => <button type="button" key={item} onClick={() => setQuestion(item)}>{item}</button>)}</div>
    <form ref={formRef} onSubmit={ask}><input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={160} placeholder="Ask one very important dog question…" aria-label="Question for your dog"/><button disabled={loading || retryAfter > 0 || !question.trim()} aria-label="Ask question"><Send size={17}/></button></form></>}
    {loading && <p className="dog-reply loading-reply">Consulting the pup…</p>}{error && <div className="inline-error" role="alert"><p className="voice-error">{error}</p><button type="button" className="voice-retry" disabled={retryAfter > 0} onClick={() => formRef.current?.requestSubmit()}><RotateCcw size={14}/> {retryAfter > 0 ? `Try again in ${retryAfter}s` : "Try again"}</button></div>}
    {answer && <div className="dog-answer"><p>“{answer}”</p><VoicePlayer text={answer} voiceStyle={analysis.voiceStyle} breedGuess={analysis.breedGuess}/></div>}
  </section>;
}
