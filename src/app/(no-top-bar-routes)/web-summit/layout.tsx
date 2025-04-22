import { CardTitle } from "@/components/ui/card";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8 py-8 w-full">
      <CardTitle>Exclusive Web Summit 2025 Trails</CardTitle>
      {children}
    </div>
  );
}
