import { useTrailTaskRunnerManager } from "@/hooks/use-trail-task-runner-manager";

interface Props {
  runId: string | undefined;
  accessToken: string | undefined;
}

export function TrailRunnerTaskManager({ runId, accessToken }: Props) {
  useTrailTaskRunnerManager({ runId, accessToken });

  return null;
}
