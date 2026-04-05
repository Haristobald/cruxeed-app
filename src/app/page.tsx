"use client";

import { useState, useCallback, useEffect } from "react";
import type { AppStep, UserInfo, ProductOptions } from "@/types";

import StepIndicator from "@/components/ui/StepIndicator";
import Step1Welcome from "@/components/steps/Step1Welcome";
import Step2Instructions from "@/components/steps/Step2Instructions";
import Step3Camera from "@/components/steps/Step3Camera";
import Step4Validation from "@/components/steps/Step4Validation";
import Step5Form from "@/components/steps/Step5Form";
import Step6Summary from "@/components/steps/Step6Summary";
import Step7Confirmation from "@/components/steps/Step7Confirmation";

import { generateOrderId, buildOrderPayload, saveDraft, loadDraft, clearDraft } from "@/lib/utils";
import { extractMeasurements } from "@/services/handMeasurementService";

export default function Home() {
  const [step, setStep] = useState<AppStep>("welcome");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [user, setUser] = useState<Partial<UserInfo>>({});
  const [product, setProduct] = useState<Partial<ProductOptions>>({});
  const [orderId] = useState(() => generateOrderId());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Restore draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      if (draft.user) setUser(draft.user);
      if (draft.product) setProduct(draft.product);
      // Don't restore step — always start fresh
    }
  }, []);

  // Save draft whenever user/product changes
  useEffect(() => {
    saveDraft({ user, product });
  }, [user, product]);

  const go = (s: AppStep) => setStep(s);

  const handlePhotoTaken = useCallback((dataUrl: string) => {
    setPhotoDataUrl(dataUrl);
    go("validation");
  }, []);

  const handleFormSubmit = useCallback((u: UserInfo, p: ProductOptions) => {
    setUser(u);
    setProduct(p);
    go("summary");
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!user || !product || !photoDataUrl) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Run measurement extraction (placeholder for now)
      const measurements = await extractMeasurements(photoDataUrl);

      const payload = buildOrderPayload(
        user as UserInfo,
        product as ProductOptions,
        photoDataUrl,
        measurements,
        orderId
      );

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erreur lors de l'envoi");
      }

      clearDraft();
      go("confirmation");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }, [user, product, photoDataUrl, orderId]);

  const handleReset = () => {
    clearDraft();
    setPhotoDataUrl(null);
    setUser({});
    setProduct({});
    go("welcome");
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative">
      <StepIndicator currentStep={step} />

      <main>
        {step === "welcome" && (
          <Step1Welcome onNext={() => go("instructions")} />
        )}

        {step === "instructions" && (
          <Step2Instructions
            onNext={() => go("camera")}
            onBack={() => go("welcome")}
          />
        )}

        {step === "camera" && (
          <Step3Camera
            onPhotoTaken={handlePhotoTaken}
            onBack={() => go("instructions")}
          />
        )}

        {step === "validation" && photoDataUrl && (
          <Step4Validation
            photoDataUrl={photoDataUrl}
            onConfirm={() => go("form")}
            onRetake={() => { setPhotoDataUrl(null); go("camera"); }}
          />
        )}

        {step === "form" && (
          <Step5Form
            initialUser={user}
            initialProduct={product}
            onSubmit={handleFormSubmit}
            onBack={() => go("validation")}
          />
        )}

        {step === "summary" && photoDataUrl && user.email && product.gripType && (
          <div>
            <Step6Summary
              photoDataUrl={photoDataUrl}
              user={user as UserInfo}
              product={product as ProductOptions}
              orderId={orderId}
              onConfirm={handleConfirm}
              onEdit={() => go("form")}
            />
            {submitting && (
              <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
                  <p className="text-sm text-stone-600 font-medium">Envoi en cours…</p>
                </div>
              </div>
            )}
            {submitError && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm px-5 py-3 rounded-2xl shadow-lg z-50 max-w-xs text-center">
                {submitError}
              </div>
            )}
          </div>
        )}

        {step === "confirmation" && (
          <Step7Confirmation
            orderId={orderId}
            email={(user as UserInfo).email}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
