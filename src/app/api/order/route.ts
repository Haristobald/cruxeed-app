import { NextRequest, NextResponse } from "next/server";
import type { OrderRequest } from "@/types";

/**
 * POST /api/order
 *
 * Receives the full order payload, validates it, and:
 * MVP  → logs the JSON + returns a success response.
 * Next → plug in: Nodemailer / Resend / Sendgrid + a DB (Postgres / Supabase).
 */
export async function POST(req: NextRequest) {
  try {
    const body: OrderRequest = await req.json();

    if (!body.id || !body.user?.email || !body.product?.gripType) {
      return NextResponse.json(
        { error: "Données de commande incomplètes." },
        { status: 400 }
      );
    }

    // ── MVP: log to console (replace with real email/DB below) ──────────────
    console.log("=== NOUVELLE COMMANDE CRUXEED ===");
    console.log(JSON.stringify(body, (key, value) => {
      // Truncate base64 photo in logs
      if (key === "photoDataUrl" && typeof value === "string") {
        return `[IMAGE BASE64 — ${Math.round(value.length / 1024)} KB]`;
      }
      return value;
    }, 2));

    // ── FUTURE: send email ──────────────────────────────────────────────────
    // await sendOrderEmail(body);   // e.g. via Resend / Nodemailer

    // ── FUTURE: save to DB ─────────────────────────────────────────────────
    // await db.orders.create({ data: body });

    return NextResponse.json({ success: true, orderId: body.id }, { status: 200 });

  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
