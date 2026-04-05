"use client";

type Props = {
  orderId: string;
  email: string;
  onReset: () => void;
};

export default function Step7Confirmation({ orderId, email, onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center">
      {/* Success icon */}
      <div className="mb-8 w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-4xl">
        ✅
      </div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-stone-900 mb-3">Demande envoyée !</h2>
      <p className="text-sm text-stone-500 max-w-xs leading-relaxed mb-8">
        Merci. Votre demande a bien été transmise. Nous allons l'étudier et revenir vers vous sous 48h.
      </p>

      {/* Order card */}
      <div className="w-full max-w-xs p-5 bg-stone-50 rounded-2xl border border-stone-200 mb-8 text-left">
        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider mb-1">Numéro de demande</p>
        <p className="text-lg font-bold font-mono text-stone-800 mb-4">{orderId}</p>

        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider mb-1">Confirmation envoyée à</p>
        <p className="text-sm font-medium text-stone-700">{email}</p>
      </div>

      {/* Info */}
      <div className="w-full max-w-xs space-y-2 mb-10">
        {[
          "📬 Confirmation par email sous peu",
          "📏 Analyse de votre photo par notre équipe",
          "🖨️ Fabrication et expédition sous 2–3 semaines",
        ].map((s) => (
          <div key={s} className="flex items-center gap-2 text-sm text-stone-500">
            <span>{s}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="w-full max-w-xs border border-stone-300 text-stone-700 font-medium py-3 rounded-2xl text-sm hover:bg-stone-50 transition-all"
      >
        Nouvelle commande
      </button>

      <p className="mt-6 text-xs text-stone-400">CRUXEED · Artisanal · Personnalisé</p>
    </div>
  );
}
