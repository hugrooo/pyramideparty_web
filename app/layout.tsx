import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import "./globals.css";
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});

export const metadata: Metadata = {
  title: "Pyramide Party - Le jeu de cartes du chaos",
  description: "Jouez à Pyramide Party en local ou en ligne avec vos amis ! Le jeu de bluff, de gages et de chaos.",
  themeColor: "#050814",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${nunito.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
