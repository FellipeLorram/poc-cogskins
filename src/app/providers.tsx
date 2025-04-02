"use client";

import { TrailSyncManager } from "@/components/sync-trail-manager";
import { TrailRunnerTaskManager } from "@/components/trail-runner-task-manager";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
  runId: string | undefined;
  accessToken: string | undefined;
}

export function Providers({ children, runId, accessToken }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <TooltipProvider>
          {children}
          <Toaster />
          <TrailSyncManager />
          <TrailRunnerTaskManager runId={runId} accessToken={accessToken} />
        </TooltipProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
