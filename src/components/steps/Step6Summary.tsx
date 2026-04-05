"use client";

import type { UserInfo, ProductOptions } from "@/types";
import { COLOR_OPTIONS, GRIP_TYPE_LABELS, DOMINANT_HAND_LABELS } from "@/types";

type Props = {
  photoDataUrl: string;
  user: UserInfo;
  product: ProductOptions;
  orderId: string;
  onConfirm: () => void;
  onEdit: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-stone-400">{label}</span>
      <span className="text-sm font-medium text-stone-800 text-right max-w-[55%]">{value}</span>
    </div>
  );
}

function ColorDot({ colorId }: { colorId: string }) {
  const color = COLOR_OPTIONS.find((c) => c.id === colorId);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="w-3 h-3 rounded-full inline-block border border-stone-200"
        style={{ backgroundColor: color?.hex }}
      />
      {color?.label}
    </span>
  );
}

export default function Step6Summary({ photoDataUrl, user, product, orderId, onConfirm, onEdit }: Props) {
  return (
    <div className="flex flex-col px-6 pt-6 pb-16">
      <h2 className="text-2xl font-bold text-stone-900 mb-1">Récapitulatif</h2>
      <p className="text-sm text-stone-500 mb-6">Vérifiez votre commande avant d'envoyer.</p>

      {/* Order ID badge */}
      <div className="flex items-center justify-between mb-6 p-4 bg-stone-50 rounded-2xl border border-stone-200">
        <div>
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Numéro de demande</p>
          <p className="text-base font-bold font-mono text-stone-800 mt-0.5">{orderId}</p>
        </div>
        <span className="text-2xl">🪨</span>
      </div>

      {/* Photo */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Votre photo</p>
        <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100" style={{ height: "160px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoDataUrl} alt="Main" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Client info */}
      <div className="mb-4 p-4 bg-white rounded-2xl border border-gray-100">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Coordonnées</p>
        <Row label="Nom" value={`${user.firstName} ${user.lastName}`} />
        <Row label="Email" value={user.email} />
        {user.phone && <Row label="Téléphone" value={user.phone} />}
      </div>

      {/* Product */}
      <div className="mb-4 p-4 bg-white rounded-2xl border border-gray-100">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Configuration</p>
        <Row label="Type" value={GRIP_TYPE_LABELS[product.gripType]} />
        <Row label="Main" value={DOMINANT_HAND_LABELS[product.dominantHand]} />
        <Row
          label="Couleur principale"
          value={COLOR_OPTIONS.find((c) => c.id === product.primaryColor)?.label ?? product.primaryColor}
        />
        <Row
          label="Couleur secondaire"
          value={COLOR_OPTIONS.find((c) => c.id === product.secondaryColor)?.label ?? product.secondaryColor}
        />
        <Row label="Nom gravé" value={`"${product.engravedName}"`} />
        {product.notes && <Row label="Remarques" value={product.notes} />}
      </div>

      {/* Visual color preview */}
      <div className="mb-8 p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-4">
        <div className="flex gap-2">
          <div
            className="w-10 h-10 rounded-xl border border-stone-200"
            style={{ backgroundColor: COLOR_OPTIONS.find((c) => c.id === product.primaryColor)?.hex }}
          />
          <div
            className="w-10 h-10 rounded-xl border border-stone-200"
            style={{ backgroundColor: COLOR_OPTIONS.find((c) => c.id === product.secondaryColor)?.hex }}
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-stone-700">{product.engravedName}</p>
          <p className="text-xs text-stone-400">{GRIP_TYPE_LABELS[product.gripType]}</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onConfirm}
          className="w-full bg-stone-900 text-white font-semibold py-4 rounded-2xl text-base hover:bg-stone-700 active:scale-95 transition-all"
        >
          Confirmer ma demande →
        </button>
        <button
          onClick={onEdit}
          className="w-full border border-stone-300 text-stone-700 font-medium py-3 rounded-2xl text-sm hover:bg-stone-50 transition-all"
        >
          Modifier
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-stone-400 leading-relaxed">
        En confirmant, vous nous transmettez votre demande de fabrication.<br />
        Fabrication artisanale · Délai estimé : 2–3 semaines.
      </p>
    </div>
  );
}
