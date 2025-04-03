import { GeneratedTrail } from "@/entities/trails";
import { generateTrailTask } from "@/trigger/trails";
import { useRealtimeRun } from "@trigger.dev/react-hooks";

interface Response {
  isGenerating: boolean;
  error: string | null;
  trail: GeneratedTrail | null;
}

interface Props {
  accessToken?: string;
  runId?: string;
}

export function useRealtimeRunner({ accessToken, runId }: Props): Response {
  const { run } = useRealtimeRun<typeof generateTrailTask>(runId, {
    accessToken: accessToken,
    enabled: !!runId && !!accessToken,
  });

  if (!accessToken || !runId) {
    return {
      isGenerating: false,
      error: null,
      trail: run?.output?.trail ?? null,
    };
  }

  const isGenerating =
    run?.status === "EXECUTING" ||
    run?.status === "QUEUED" ||
    run?.status === "REATTEMPTING";

  return {
    isGenerating,
    error: run?.error?.message ?? null,
    trail: run?.output?.trail ?? null,
  };
}
