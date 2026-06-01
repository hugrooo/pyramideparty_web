import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#050814",
};

export const metadata: Metadata = {
  title: "Pyramide Party - Le jeu de cartes du chaos",
  description: "Jouez à Pyramide Party en local ou en ligne avec vos amis ! Le jeu de bluff, de gages et de chaos.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
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
