"use client";

import { useState } from "react";

type Props = {
  photoDataUrl: string;
  onConfirm: () => void;
  onRetake: () => void;
};

const QUESTIONS = [
  { id: "whole", text: "La main entière est visible dans la photo" },
  { id: "topdown", text: "La photo est bien prise de dessus" },
  { id: "shadow", text: "Il y a peu ou pas d'ombre sur la main" },
  { id: "a4", text: "La feuille A4 est visible sous la main" },
];

export default function Step4Validation({ photoDataUrl, onConfirm, onRetake }: Props) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));

  const allOk = QUESTIONS.every((q) => answers[q.id]);

  return (
    <div className="flex flex-col min-h-[85vh] px-6 pt-6 pb-10">
      <h2 className="text-2xl font-bold text-stone-900 mb-1">Vérifiez votre photo</h2>
      <p className="text-sm text-stone-500 mb-6">
        Validez chaque point avant de continuer.
      </p>

      {/* Photo preview */}
      <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 mb-6" style={{ height: "220px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoDataUrl}
          alt="Votre photo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Validation questions */}
      <div className="space-y-3 flex-1">
        {QUESTIONS.map((q) => (
          <button
            key={q.id}
            onClick={() => toggle(q.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
              answers[q.id]
                ? "border-stone-800 bg-stone-50"
                : "border-gray-200 bg-white hover:border-stone-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                answers[q.id] ? "border-stone-800 bg-stone-800" : "border-gray-300"
              }`}
            >
              {answers[q.id] && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${answers[q.id] ? "text-stone-800 font-medium" : "text-stone-600"}`}>
              {q.text}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={onConfirm}
          disabled={!allOk}
          className={`w-full font-semibold py-4 rounded-2xl text-base transition-all ${
            allOk
              ? "bg-stone-900 text-white hover:bg-stone-700 active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {allOk ? "Photo validée — Continuer →" : `${Object.values(answers).filter(Boolean).length}/${QUESTIONS.length} points validés`}
        </button>
        <button
          onClick={onRetake}
          className="w-full border border-stone-300 text-stone-700 font-medium py-3 rounded-2xl text-sm hover:bg-stone-50 transition-all"
        >
          Reprendre la photo
        </button>
      </div>
    </div>
  );
}
