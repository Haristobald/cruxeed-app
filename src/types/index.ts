// ─── Core Types ────────────────────────────────────────────────────────────────

export type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  consent: boolean;
};

export type GripType = "warmup" | "half-crimp" | "rehab";
export type DominantHand = "left" | "right" | "both";

export type ProductOptions = {
  dominantHand: DominantHand;
  gripType: GripType;
  primaryColor: string;
  secondaryColor: string;
  engravedName: string;
  notes?: string;
};

// Prepared for future CV integration
export type DesignMeasurements = {
  referenceScale: number | null;
  indexOffset: number | null;
  middleOffset: number | null;
  ringOffset: number | null;
  pinkyOffset: number | null;
  indexWidth: number | null;
  middleWidth: number | null;
  ringWidth: number | null;
  pinkyWidth: number | null;
  notes: string;
};

export type OrderRequest = {
  id: string;
  createdAt: string;
  user: UserInfo;
  product: ProductOptions;
  photoDataUrl?: string;
  designMeasurements: DesignMeasurements;
};

// ─── App State ──────────────────────────────────────────────────────────────────

export type AppStep =
  | "welcome"
  | "instructions"
  | "camera"
  | "validation"
  | "form"
  | "summary"
  | "confirmation";

export type AppState = {
  step: AppStep;
  photoDataUrl: string | null;
  user: Partial<UserInfo>;
  product: Partial<ProductOptions>;
  orderId: string | null;
};

// ─── Colors ────────────────────────────────────────────────────────────────────

export type ColorOption = {
  id: string;
  label: string;
  hex: string;
};

export const COLOR_OPTIONS: ColorOption[] = [
  { id: "black", label: "Noir", hex: "#1a1a1a" },
  { id: "white", label: "Blanc", hex: "#f5f5f5" },
  { id: "gray", label: "Gris", hex: "#6b7280" },
  { id: "blue", label: "Bleu", hex: "#2563eb" },
  { id: "red", label: "Rouge", hex: "#dc2626" },
  { id: "orange", label: "Orange", hex: "#ea580c" },
  { id: "yellow", label: "Jaune", hex: "#ca8a04" },
  { id: "green", label: "Vert", hex: "#16a34a" },
  { id: "pink", label: "Rose", hex: "#db2777" },
  { id: "purple", label: "Violet", hex: "#7c3aed" },
];

export const GRIP_TYPE_LABELS: Record<GripType, string> = {
  warmup: "Échauffement",
  "half-crimp": "Semi-arquée",
  rehab: "Rééducation",
};

export const DOMINANT_HAND_LABELS: Record<DominantHand, string> = {
  left: "Gauche",
  right: "Droite",
  both: "Les deux",
};
