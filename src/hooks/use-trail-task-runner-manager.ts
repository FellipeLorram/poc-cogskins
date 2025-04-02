import { clearRunCookies } from "@/api/utils/clear-run-cookies";
import { useSaveTrail } from "@/hooks/trails/use-save-trail";
import { useTrailStore } from "@/stores/trail-store";
import { generateTrailTask } from "@/trigger/trails";
import { useRealtimeRun } from "@trigger.dev/react-hooks";

interface Props {
  runId: string | undefined;
  accessToken: string | undefined;
}

export function useTrailTaskRunnerManager({ runId, accessToken }: Props) {
  const { setGenerating, setError, setGeneratingTrailContents } =
    useTrailStore();
  const { mutate: saveTrail } = useSaveTrail();

  useRealtimeRun<typeof generateTrailTask>(runId, {
    accessToken: accessToken,
    enabled: !!runId && !!accessToken,
    onComplete(run, err) {
      if (err || !run.output) {
        setGenerating(false);
        setError(err?.message || "Não foi possível gerar o conteúdo");
        clearRunCookies();
        return;
      }

      if ("error" in run.output.trail) {
        setError(run.output.trail.error);
        return;
      }

      saveTrail(run.output.trail);
      setGenerating(false);
      setError(null);
      setGeneratingTrailContents([]);
      clearRunCookies();
    },
  });
}
