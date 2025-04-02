import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
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
  const cookieStore = await cookies();
  const runId = cookieStore.get("run-task-id")?.value;
  const accessToken = cookieStore.get("run-task-access-token")?.value;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers runId={runId} accessToken={accessToken}>
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
