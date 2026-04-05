/**
 * handMeasurementService.ts
 *
 * Placeholder service for future computer vision / biometric extraction.
 * All functions are typed and documented for easy future integration
 * (e.g. MediaPipe Hands, TensorFlow.js, or a server-side CV API).
 */

import type { DesignMeasurements } from "@/types";

export type ValidationResult = {
  isValid: boolean;
  warnings: string[];
  confidence: number; // 0–1
};

/**
 * Validates that a photo likely contains a correctly placed hand.
 * MVP: returns mock success.
 * Future: run image classification or landmark detection.
 */
export async function validateHandPhoto(
  imageDataUrl: string
): Promise<ValidationResult> {
  // TODO: integrate MediaPipe Hands or a lightweight ONNX model
  await new Promise((r) => setTimeout(r, 300)); // simulate async

  return {
    isValid: true,
    warnings: [],
    confidence: 1,
  };
}

/**
 * Extracts the pixel-to-mm scale using a reference object (A4 sheet).
 * MVP: returns null.
 * Future: detect A4 corners via contour detection → compute px/mm ratio.
 */
export async function extractReferenceScale(
  imageDataUrl: string
): Promise<number | null> {
  // TODO: A4 sheet = 210mm × 297mm → detect edges → compute scale
  return null;
}

/**
 * Extracts the vertical offset of each fingertip relative to the middle finger.
 * MVP: returns null for all values.
 * Future: MediaPipe hand landmarks → compute relative offsets in mm.
 */
export async function extractFingerOffsets(
  imageDataUrl: string,
  referenceScale: number | null
): Promise<Pick<DesignMeasurements, "indexOffset" | "middleOffset" | "ringOffset" | "pinkyOffset">> {
  // TODO: landmarks[8], [12], [16], [20] → fingertip positions → offsets
  return {
    indexOffset: null,
    middleOffset: null,
    ringOffset: null,
    pinkyOffset: null,
  };
}

/**
 * Extracts the width of each finger at the proximal phalanx.
 * MVP: returns null for all values.
 * Future: compute horizontal distance between edges at each finger base.
 */
export async function extractFingerWidths(
  imageDataUrl: string,
  referenceScale: number | null
): Promise<Pick<DesignMeasurements, "indexWidth" | "middleWidth" | "ringWidth" | "pinkyWidth">> {
  // TODO: landmarks at phalanx positions → compute widths in mm
  return {
    indexWidth: null,
    middleWidth: null,
    ringWidth: null,
    pinkyWidth: null,
  };
}

/**
 * Full pipeline: runs all extractions and returns a DesignMeasurements object.
 */
export async function extractMeasurements(
  imageDataUrl: string
): Promise<DesignMeasurements> {
  const referenceScale = await extractReferenceScale(imageDataUrl);
  const offsets = await extractFingerOffsets(imageDataUrl, referenceScale);
  const widths = await extractFingerWidths(imageDataUrl, referenceScale);

  return {
    referenceScale,
    ...offsets,
    ...widths,
    notes: referenceScale === null
      ? "Mesures à compléter manuellement — analyse automatique non encore disponible."
      : "Mesures extraites automatiquement.",
  };
}
