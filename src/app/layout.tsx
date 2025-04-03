import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { TopBar } from "../components/top-bar/top-bar";
import "./globals.css";
import { Providers } from "./providers";
import { SignInDialog } from "./signin-dialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CogSkins",
  description: "Que tal validar seu conhecimento em um novo assunto?",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="w-11/12 relative max-w-6xl mx-auto flex flex-col items-center justify-start min-h-screen">
            <TopBar />
            <Suspense>
              <SignInDialog />
            </Suspense>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
