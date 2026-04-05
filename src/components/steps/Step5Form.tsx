"use client";

import { useState } from "react";
import type { UserInfo, ProductOptions, GripType, DominantHand } from "@/types";
import { COLOR_OPTIONS } from "@/types";
import { isValidEmail } from "@/lib/utils";

type Props = {
  initialUser: Partial<UserInfo>;
  initialProduct: Partial<ProductOptions>;
  onSubmit: (user: UserInfo, product: ProductOptions) => void;
  onBack: () => void;
};

const MAX_NAME_LENGTH = 18;

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            title={c.label}
            className={`w-9 h-9 rounded-full border-2 transition-all ${
              value === c.id
                ? "border-stone-900 scale-110 shadow-md"
                : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
      {value && (
        <p className="mt-1.5 text-xs text-stone-400">
          Sélectionné : {COLOR_OPTIONS.find((c) => c.id === value)?.label}
        </p>
      )}
    </div>
  );
}

export default function Step5Form({ initialUser, initialProduct, onSubmit, onBack }: Props) {
  const [user, setUser] = useState<Partial<UserInfo>>(initialUser);
  const [product, setProduct] = useState<Partial<ProductOptions>>(initialProduct);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const setU = (k: keyof UserInfo, v: string | boolean) =>
    setUser((p) => ({ ...p, [k]: v }));
  const setP = (k: keyof ProductOptions, v: string) =>
    setProduct((p) => ({ ...p, [k]: v }));

  const touch = (k: string) => setTouched((p) => new Set(p).add(k));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!user.firstName?.trim()) e.firstName = "Prénom requis";
    if (!user.lastName?.trim()) e.lastName = "Nom requis";
    if (!user.email?.trim()) e.email = "Email requis";
    else if (!isValidEmail(user.email)) e.email = "Email invalide";
    if (!product.dominantHand) e.dominantHand = "Requis";
    if (!product.gripType) e.gripType = "Requis";
    if (!product.primaryColor) e.primaryColor = "Choisissez une couleur principale";
    if (!product.secondaryColor) e.secondaryColor = "Choisissez une couleur secondaire";
    if (!product.engravedName?.trim()) e.engravedName = "Requis";
    else if (product.engravedName.length > MAX_NAME_LENGTH)
      e.engravedName = `Maximum ${MAX_NAME_LENGTH} caractères`;
    if (!user.consent) e.consent = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    // Touch all fields
    setTouched(
      new Set(["firstName", "lastName", "email", "dominantHand", "gripType", "primaryColor", "secondaryColor", "engravedName", "consent"])
    );
    if (!validate()) return;
    onSubmit(user as UserInfo, product as ProductOptions);
  };

  const err = (k: string) =>
    touched.has(k) && errors[k] ? (
      <p className="text-xs text-red-500 mt-1">{errors[k]}</p>
    ) : null;

  const inputClass = (k: string) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
      touched.has(k) && errors[k]
        ? "border-red-300 focus:ring-red-200"
        : "border-gray-200 focus:ring-stone-200 focus:border-stone-400"
    }`;

  const gripTypes: { id: GripType; label: string; desc: string }[] = [
    { id: "warmup", label: "Échauffement", desc: "Prise ouverte, faible contrainte" },
    { id: "half-crimp", label: "Semi-arquée", desc: "Travail spécifique des doigts" },
    { id: "rehab", label: "Rééducation", desc: "Faible résistance, anatomique" },
  ];

  const hands: { id: DominantHand; label: string }[] = [
    { id: "right", label: "Droite" },
    { id: "left", label: "Gauche" },
    { id: "both", label: "Les deux" },
  ];

  return (
    <div className="flex flex-col px-6 pt-6 pb-16">
      <button onClick={onBack} className="text-stone-400 text-sm mb-6 text-left hover:text-stone-700 transition-colors">
        ← Retour
      </button>

      <h2 className="text-2xl font-bold text-stone-900 mb-1">Personnalisation</h2>
      <p className="text-sm text-stone-500 mb-8">Toutes les informations pour votre prise sur mesure.</p>

      <div className="space-y-6">

        {/* ── Contact ── */}
        <section>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Vos coordonnées</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  className={inputClass("firstName")}
                  placeholder="Prénom *"
                  value={user.firstName ?? ""}
                  onChange={(e) => setU("firstName", e.target.value)}
                  onBlur={() => touch("firstName")}
                />
                {err("firstName")}
              </div>
              <div>
                <input
                  className={inputClass("lastName")}
                  placeholder="Nom *"
                  value={user.lastName ?? ""}
                  onChange={(e) => setU("lastName", e.target.value)}
                  onBlur={() => touch("lastName")}
                />
                {err("lastName")}
              </div>
            </div>
            <div>
              <input
                type="email"
                className={inputClass("email")}
                placeholder="Email *"
                value={user.email ?? ""}
                onChange={(e) => setU("email", e.target.value)}
                onBlur={() => touch("email")}
              />
              {err("email")}
            </div>
            <input
              type="tel"
              className={inputClass("phone")}
              placeholder="Téléphone (optionnel)"
              value={user.phone ?? ""}
              onChange={(e) => setU("phone", e.target.value)}
            />
          </div>
        </section>

        {/* ── Dominant hand ── */}
        <section>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Main concernée *</h3>
          <div className="flex gap-2">
            {hands.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => { setP("dominantHand", h.id); touch("dominantHand"); }}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                  product.dominantHand === h.id
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-gray-200 text-stone-600 hover:border-stone-400"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
          {err("dominantHand")}
        </section>

        {/* ── Grip type ── */}
        <section>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Type de prise *</h3>
          <div className="space-y-2">
            {gripTypes.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => { setP("gripType", g.id); touch("gripType"); }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                  product.gripType === g.id
                    ? "border-stone-900 bg-stone-50"
                    : "border-gray-200 hover:border-stone-300"
                }`}
              >
                <div>
                  <p className={`text-sm font-semibold ${product.gripType === g.id ? "text-stone-900" : "text-stone-700"}`}>
                    {g.label}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">{g.desc}</p>
                </div>
                {product.gripType === g.id && (
                  <div className="w-4 h-4 rounded-full bg-stone-900 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          {err("gripType")}
        </section>

        {/* ── Colors ── */}
        <section>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Couleurs *</h3>
          <div className="space-y-4">
            <ColorPicker
              label="Couleur principale"
              value={product.primaryColor ?? ""}
              onChange={(v) => { setP("primaryColor", v); touch("primaryColor"); }}
            />
            {err("primaryColor")}
            <ColorPicker
              label="Couleur secondaire"
              value={product.secondaryColor ?? ""}
              onChange={(v) => { setP("secondaryColor", v); touch("secondaryColor"); }}
            />
            {err("secondaryColor")}

            {/* Color preview */}
            {product.primaryColor && product.secondaryColor && (
              <div className="flex gap-2 items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="w-8 h-8 rounded-lg border border-stone-200"
                  style={{ backgroundColor: COLOR_OPTIONS.find((c) => c.id === product.primaryColor)?.hex }} />
                <div className="w-8 h-8 rounded-lg border border-stone-200"
                  style={{ backgroundColor: COLOR_OPTIONS.find((c) => c.id === product.secondaryColor)?.hex }} />
                <p className="text-xs text-stone-500 ml-1">Aperçu de vos couleurs</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Engraved name ── */}
        <section>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Nom à graver *</h3>
          <div className="relative">
            <input
              className={inputClass("engravedName")}
              placeholder="Ex : Alex, CRUX, Team..."
              maxLength={MAX_NAME_LENGTH}
              value={product.engravedName ?? ""}
              onChange={(e) => setP("engravedName", e.target.value)}
              onBlur={() => touch("engravedName")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">
              {(product.engravedName ?? "").length}/{MAX_NAME_LENGTH}
            </span>
          </div>
          {err("engravedName")}
        </section>

        {/* ── Notes ── */}
        <section>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Remarques libres</h3>
          <textarea
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 transition-all resize-none"
            rows={3}
            placeholder="Blessures, contraintes, souhaits particuliers…"
            value={product.notes ?? ""}
            onChange={(e) => setP("notes", e.target.value)}
          />
        </section>

        {/* ── Consent ── */}
        <section>
          <button
            type="button"
            onClick={() => { setU("consent", !user.consent); touch("consent"); }}
            className="flex items-start gap-3 text-left"
          >
            <div
              className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                user.consent ? "border-stone-800 bg-stone-800" : "border-gray-300"
              }`}
            >
              {user.consent && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                </svg>
              )}
            </div>
            <span className="text-xs text-stone-500 leading-relaxed">
              J'accepte que ma photo de main soit utilisée uniquement dans le cadre de la fabrication de ma prise personnalisée CRUXEED. *
            </span>
          </button>
          {err("consent")}
        </section>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 w-full bg-stone-900 text-white font-semibold py-4 rounded-2xl text-base hover:bg-stone-700 active:scale-95 transition-all"
      >
        Voir le récapitulatif →
      </button>
    </div>
  );
}
