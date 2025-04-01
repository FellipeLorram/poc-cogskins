"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TrailSyncManager } from "@/components/sync-trail-manager";
import { Suspense } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <Suspense>{children}</Suspense>
        <Toaster />
        <TrailSyncManager />
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
