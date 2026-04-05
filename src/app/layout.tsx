import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRUXEED — Prises personnalisées",
  description: "Configurez votre prise d'escalade personnalisée à partir de votre main.",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "CRUXEED" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // prevent zoom on form inputs
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geist.className} bg-gray-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
