import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopHeader from "@/components/TopHeader";
import { ChallengesProvider } from "@/contexts/ChallengesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paladio77 - Retos Deportivos Web3",
  description: "La plataforma de retos deportivos Web3 más innovadora. Crea retos con criptomonedas en eventos deportivos de todo el mundo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen`}
      >
        <ChallengesProvider>
          <TopHeader />
          <main className="min-h-screen">
            {children}
          </main>
        </ChallengesProvider>
      </body>
    </html>
  );
}
