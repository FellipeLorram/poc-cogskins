import React, { Suspense } from "react";
import { SignInDialog } from "../signin-dialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-11/12 relative max-w-6xl mx-auto flex flex-col items-center justify-start min-h-screen">
      <Suspense>
        <SignInDialog />
      </Suspense>
      {children}
    </div>
  );
}
