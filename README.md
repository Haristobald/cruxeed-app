# CRUXEED — Web App MVP

Prise d'escalade personnalisée · Configurateur web mobile-first

---

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Déploiement** : Vercel (zero config)

---

## Lancer en local

```bash
# 1. Créer le projet Next.js et copier les fichiers
npx create-next-app@latest cruxeed-app --typescript --tailwind --app --src-dir --import-alias "@/*"
cd cruxeed-app

# 2. Copier tous les fichiers de ce repo dans le dossier
# (remplacer les fichiers existants)

# 3. Installer les dépendances
npm install

# 4. Lancer
npm run dev
```

Ouvrir **http://localhost:3000**

---

## Architecture

```
src/
├── app/
│   ├── api/order/route.ts     ← Endpoint API : reçoit la commande (POST)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               ← Orchestrateur principal des étapes
│
├── components/
│   ├── steps/
│   │   ├── Step1Welcome.tsx       ← Accueil + CTA
│   │   ├── Step2Instructions.tsx  ← Protocole photo + checklist interactive
│   │   ├── Step3Camera.tsx        ← Caméra native + import galerie + compression
│   │   ├── Step4Validation.tsx    ← Vérification photo par l'utilisateur
│   │   ├── Step5Form.tsx          ← Formulaire complet de personnalisation
│   │   ├── Step6Summary.tsx       ← Récapitulatif avant envoi
│   │   └── Step7Confirmation.tsx  ← Page de succès
│   └── ui/
│       └── StepIndicator.tsx      ← Barre de progression 4 étapes
│
├── lib/
│   └── utils.ts               ← generateOrderId, compressImage, saveDraft, buildOrderPayload
│
├── services/
│   └── handMeasurementService.ts  ← CV placeholders (validateHandPhoto, extractMeasurements…)
│
└── types/
    └── index.ts               ← UserInfo, ProductOptions, DesignMeasurements, OrderRequest
```

---

## Parcours utilisateur

| Étape | Écran | Description |
|-------|-------|-------------|
| 1 | Welcome | Présentation CRUXEED + bouton Commencer |
| 2 | Instructions | Checklist protocole photo (doit tout cocher pour continuer) |
| 3 | Caméra | Caméra native (env. = arrière) ou import galerie + compression auto |
| 4 | Validation | L'utilisateur vérifie sa photo sur 4 critères |
| 5 | Formulaire | Coordonnées + main + type de prise + couleurs + nom gravé + consentement |
| 6 | Récapitulatif | Aperçu complet + numéro de commande généré |
| 7 | Confirmation | Succès + prochaines étapes |

---

## Payload JSON envoyé à l'API

```json
{
  "id": "CRX-20250405-X7K2P",
  "createdAt": "2025-04-05T14:23:00.000Z",
  "user": {
    "firstName": "Alex",
    "lastName": "Dupont",
    "email": "alex@example.com",
    "phone": "+33 6 12 34 56 78",
    "consent": true
  },
  "product": {
    "dominantHand": "right",
    "gripType": "half-crimp",
    "primaryColor": "blue",
    "secondaryColor": "black",
    "engravedName": "ALEX",
    "notes": ""
  },
  "photoDataUrl": "data:image/jpeg;base64,...",
  "designMeasurements": {
    "referenceScale": null,
    "indexOffset": null,
    "middleOffset": null,
    "ringOffset": null,
    "pinkyOffset": null,
    "indexWidth": null,
    "middleWidth": null,
    "ringWidth": null,
    "pinkyWidth": null,
    "notes": "Mesures à compléter manuellement — analyse automatique non encore disponible."
  }
}
```

---

## Branchements futurs

### Email (Resend / Nodemailer)
Dans `src/app/api/order/route.ts`, décommenter et brancher :
```ts
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);
// await resend.emails.send({ from: '...', to: body.user.email, ... });
```

### Base de données (Supabase / Prisma)
```ts
// await db.orders.create({ data: body });
```

### Computer Vision
Dans `src/services/handMeasurementService.ts`, remplacer les fonctions placeholder par :
- MediaPipe Hands (browser)
- Un endpoint Python (FastAPI + OpenCV) appelé côté serveur

### Déploiement Vercel
```bash
npx vercel
```
Zero configuration nécessaire.

---

## Variables d'environnement (future)

```env
# .env.local
RESEND_API_KEY=re_xxxx
DATABASE_URL=postgresql://...
ADMIN_WEBHOOK_URL=https://...
```

---

## Notes MVP

- La photo est compressée côté client (max 1200px, JPEG 82%) avant envoi
- Le brouillon (user + product) est sauvegardé dans `localStorage` automatiquement
- Le numéro de commande est généré côté client (`CRX-YYYYMMDD-XXXXX`)
- Les mesures design (`designMeasurements`) sont toutes à `null` en attendant l'intégration CV
- L'API route logue le payload complet dans la console serveur (Next.js terminal)
