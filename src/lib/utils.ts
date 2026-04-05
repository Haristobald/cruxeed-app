import type { AppState } from "@/types";

// ─── Order ID ──────────────────────────────────────────────────────────────────

export function generateOrderId(): string {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `CRX-${datePart}-${random}`;
}

// ─── Image Compression ─────────────────────────────────────────────────────────

export function compressImage(
  dataUrl: string,
  maxWidthPx = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidthPx / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
}

// ─── Local Storage Persistence ─────────────────────────────────────────────────

const STORAGE_KEY = "cruxeed_draft";

export function saveDraft(state: Partial<AppState>): void {
  try {
    // Don't persist heavy photo data to avoid quota issues — only metadata
    const { photoDataUrl, ...rest } = state as AppState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // Quota exceeded or SSR — silently ignore
  }
}

export function loadDraft(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// ─── Validation helpers ────────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return /^[+\d\s\-().]{7,20}$/.test(phone.trim());
}

// ─── Payload builder ──────────────────────────────────────────────────────────

import type { OrderRequest, UserInfo, ProductOptions, DesignMeasurements } from "@/types";

export function buildOrderPayload(
  user: UserInfo,
  product: ProductOptions,
  photoDataUrl: string | null | undefined,
  measurements: DesignMeasurements,
  orderId: string
): OrderRequest {
  return {
    id: orderId,
    createdAt: new Date().toISOString(),
    user,
    product,
    photoDataUrl: photoDataUrl ?? undefined,
    designMeasurements: measurements,
  };
}
