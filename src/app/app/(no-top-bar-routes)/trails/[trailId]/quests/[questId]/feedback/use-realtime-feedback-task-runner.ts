import { PersonalizedFeedback } from "@/api/quest/generate-feedback";
import { generateFeedbackTask } from "@/trigger/feedback";
import { useRealtimeRun } from "@trigger.dev/react-hooks";

interface Response {
  isGenerating: boolean;
  error: string | null;
  feedback: PersonalizedFeedback | null;
}

interface Props {
  accessToken?: string;
  runId?: string;
}

export function useRealtimeFeedbackTaskRunner({
  accessToken,
  runId,
}: Props): Response {
  const { run } = useRealtimeRun<typeof generateFeedbackTask>(runId, {
    accessToken: accessToken,
    enabled: !!runId && !!accessToken,
  });

  if (!accessToken || !runId) {
    return {
      isGenerating: false,
      error: null,
      feedback: run?.output?.feedback ?? null,
    };
  }

  const isGenerating =
    run?.status === "EXECUTING" ||
    run?.status === "QUEUED" ||
    run?.status === "WAITING";

  return {
    isGenerating,
    error: run?.error?.message ?? null,
    feedback: run?.output?.feedback ?? null,
  };
}
