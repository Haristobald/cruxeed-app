"use client";

type Props = { onNext: () => void };

export default function Step1Welcome({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center">
      {/* Brand */}
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tight text-stone-900 mb-1">
          CRUXEED
        </h1>
        <div className="h-0.5 w-12 bg-stone-800 mx-auto" />
      </div>

      {/* Hero */}
      <div className="mb-10 max-w-xs">
        <p className="text-xl font-semibold text-stone-800 mb-3 leading-snug">
          Votre prise personnalisée,<br />adaptée à votre main.
        </p>
        <p className="text-sm text-stone-500 leading-relaxed">
          Prises d'escalade imprimées en 3D, conçues à partir de votre anatomie.
          Échauffement, travail des doigts, rééducation.
        </p>
      </div>

      {/* Illustration placeholder */}
      <div className="mb-10 w-40 h-40 rounded-3xl bg-stone-100 flex items-center justify-center border border-stone-200">
        <svg className="w-20 h-20 text-stone-300" viewBox="0 0 64 64" fill="none">
          {/* Simple hand SVG */}
          <path
            d="M32 48c0 0-16-8-16-22c0-8 4-12 8-12c2 0 4 1 5 3V10c0-2 2-3 4-3s4 1 4 3v7c1-1 2-2 4-2s4 1 4 3v2c1-1 2-1 3-1c2 0 3 1 3 3v8c0 4-2 12-6 16L32 48z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M32 48c0 0-16-8-16-22c0-8 4-12 8-12c2 0 4 1 5 3V10c0-2 2-3 4-3s4 1 4 3v7c1-1 2-2 4-2s4 1 4 3v2c1-1 2-1 3-1c2 0 3 1 3 3v8c0 4-2 12-6 16L32 48z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Steps preview */}
      <div className="mb-10 flex gap-6 text-xs text-stone-400 font-medium">
        {["Photo", "Personnalisation", "Commande"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <span>›</span>}
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full max-w-xs bg-stone-900 text-white font-semibold py-4 px-8 rounded-2xl text-base hover:bg-stone-700 active:scale-95 transition-all"
      >
        Commencer →
      </button>

      <p className="mt-4 text-xs text-stone-400">
        Artisanal · Personnalisé · Fabriqué en France
      </p>
    </div>
  );
}
