"use client";

import type { AppStep } from "@/types";

type Props = { currentStep: AppStep };

const STEPS: { id: AppStep; label: string }[] = [
  { id: "camera", label: "Photo" },
  { id: "form", label: "Personnalisation" },
  { id: "summary", label: "Vérification" },
  { id: "confirmation", label: "Envoi" },
];

const STEP_ORDER: AppStep[] = [
  "welcome",
  "instructions",
  "camera",
  "validation",
  "form",
  "summary",
  "confirmation",
];

function getProgress(current: AppStep): number {
  return STEP_ORDER.indexOf(current);
}

export default function StepIndicator({ currentStep }: Props) {
  if (currentStep === "welcome" || currentStep === "instructions") return null;

  const progress = getProgress(currentStep);

  return (
    <div className="w-full px-6 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {STEPS.map((step, i) => {
          const stepProgress = getProgress(step.id);
          const isActive = step.id === currentStep;
          const isDone = progress > stepProgress;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isDone
                      ? "bg-stone-800 text-white"
                      : isActive
                      ? "bg-stone-800 text-white ring-4 ring-stone-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium whitespace-nowrap ${
                    isActive ? "text-stone-800" : isDone ? "text-stone-500" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px w-8 mx-1 mb-4 transition-all ${
                    progress > stepProgress ? "bg-stone-800" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
