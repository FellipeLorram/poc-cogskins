import { clearRunCookies } from "@/api/utils/clear-run-cookies";
import { useSaveTrail } from "@/hooks/trails/use-save-trail";
import { useTrailStore } from "@/stores/trail-store";
import { generateTrailTask } from "@/trigger/trails";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { useEffect } from "react";

interface Props {
  runId: string | undefined;
  accessToken: string | undefined;
}

export function useTrailTaskRunnerManager({ runId, accessToken }: Props) {
  const { setGenerating, setError, setGeneratingTrailContents } =
    useTrailStore();
  const { mutate: saveTrail } = useSaveTrail();

  const { run, error } = useRealtimeRun<typeof generateTrailTask>(runId, {
    accessToken: accessToken,
    enabled: !!runId && !!accessToken,
  });

  useEffect(() => {
    if (error) {
      setError(error.message || "Não foi possível gerar o conteúdo");
      return;
    }

    if (
      !runId ||
      !accessToken ||
      !run ||
      run.status !== "COMPLETED" ||
      !run.output
    ) {
      return;
    }

    if ("error" in run.output.trail) {
      setError(run.output?.trail.error || "Não foi possível gerar o conteúdo");
      return;
    }

    saveTrail(run.output.trail);
    setGenerating(false);
    setError(null);
    setGeneratingTrailContents([]);
    clearRunCookies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, runId, accessToken, error]);
}
