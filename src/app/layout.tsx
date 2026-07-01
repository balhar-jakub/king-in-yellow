import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Ve Žluté 20. 2. 2027",
  description:
    "Ve Žluté — Večer plný tajemství očekává pár vybraných. Lovecraftovský ples v Plzni, Únor 20, 2027.",
  openGraph: {
    type: "website",
    title: "Ve Žluté 20. 2. 2027",
    description:
      "Ve Žluté — Večer plný tajemství očekává pár vybraných. Lovecraftovský ples v Plzni, Únor 20, 2027.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ve Žluté 20. 2. 2027",
    description:
      "Ve Žluté — Večer plný tajemství očekává pár vybraných. Lovecraftovský ples v Plzni, Únor 20, 2027.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className={`${cinzel.variable} ${cormorantGaramond.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
