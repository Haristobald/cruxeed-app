"use client";

import { useState } from "react";

type Props = { onNext: () => void; onBack: () => void };

const CHECKLIST = [
  { icon: "📄", text: "Poser une feuille A4 blanche sous la main" },
  { icon: "🤚", text: "Main à plat, doigts détendus et légèrement écartés" },
  { icon: "📸", text: "Photo prise bien de dessus, sans incliner le téléphone" },
  { icon: "☀️", text: "Bonne lumière, éviter les ombres fortes" },
  { icon: "🔍", text: "Toute la main doit être visible dans le cadre" },
  { icon: "🧹", text: "Fond neutre et propre autour de la feuille" },
];

export default function Step2Instructions({ onNext, onBack }: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const allChecked = checked.size === CHECKLIST.length;

  return (
    <div className="flex flex-col min-h-[85vh] px-6 pt-6 pb-10">
      <button onClick={onBack} className="text-stone-400 text-sm mb-6 text-left hover:text-stone-700 transition-colors">
        ← Retour
      </button>

      <h2 className="text-2xl font-bold text-stone-900 mb-1">Préparez votre photo</h2>
      <p className="text-sm text-stone-500 mb-8">
        Une photo bien prise garantit une prise parfaitement ajustée.
      </p>

      {/* Visual diagram */}
      <div className="mb-8 rounded-2xl bg-stone-100 border border-stone-200 p-6 flex flex-col items-center">
        <div className="relative w-48 h-48">
          {/* A4 sheet */}
          <div className="absolute inset-0 rounded-xl bg-white border-2 border-dashed border-stone-300 flex items-center justify-center">
            <span className="absolute top-2 right-2 text-[10px] text-stone-300 font-mono">A4</span>
            {/* Hand silhouette */}
            <svg viewBox="0 0 100 110" className="w-24 h-24 text-stone-400" fill="currentColor">
              <ellipse cx="50" cy="85" rx="22" ry="14" opacity="0.25" />
              {/* Palm */}
              <rect x="28" y="52" width="44" height="32" rx="10" opacity="0.35" />
              {/* Fingers */}
              <rect x="30" y="22" width="10" height="36" rx="5" opacity="0.35" />
              <rect x="43" y="16" width="10" height="40" rx="5" opacity="0.45" />
              <rect x="56" y="18" width="10" height="38" rx="5" opacity="0.4" />
              <rect x="69" y="24" width="9" height="32" rx="4.5" opacity="0.35" />
              {/* Thumb */}
              <ellipse cx="22" cy="62" rx="7" ry="12" transform="rotate(-30 22 62)" opacity="0.3" />
            </svg>
          </div>
          {/* Camera icon */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-base shadow">
            📷
          </div>
          {/* Arrow indicating top-down */}
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-lg rotate-90">
            ↓
          </div>
        </div>
        <p className="mt-3 text-xs text-stone-400 font-medium">Vue de dessus · Feuille A4 · Main détendue</p>
      </div>

      {/* Checklist */}
      <div className="space-y-3 flex-1">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
          Checklist
        </p>
        {CHECKLIST.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              checked.has(i)
                ? "border-stone-800 bg-stone-50"
                : "border-gray-100 bg-white hover:border-stone-300"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className={`text-sm flex-1 ${checked.has(i) ? "text-stone-800 font-medium" : "text-stone-600"}`}>
              {item.text}
            </span>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                checked.has(i) ? "border-stone-800 bg-stone-800" : "border-gray-300"
              }`}
            >
              {checked.has(i) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {!allChecked && (
          <p className="text-center text-xs text-stone-400 mb-3">
            Cochez chaque point pour continuer
          </p>
        )}
        <button
          onClick={onNext}
          disabled={!allChecked}
          className={`w-full font-semibold py-4 rounded-2xl text-base transition-all ${
            allChecked
              ? "bg-stone-900 text-white hover:bg-stone-700 active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {allChecked ? "Prendre la photo →" : `${checked.size}/${CHECKLIST.length} points validés`}
        </button>
      </div>
    </div>
  );
}
