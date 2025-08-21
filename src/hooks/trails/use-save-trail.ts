import { GeneratedTrail } from "@/entities/trails";
import { useMutation } from "@tanstack/react-query";
import { useDataLayer } from "../use-data-layer/use-data-layer";
import { useInvalidateQuery } from "../use-invalidate-query";

interface Props {
  onSuccess?: () => void;
}

export function useSaveTrail({ onSuccess }: Props) {
  const { invalidate } = useInvalidateQuery({
    queryKey: ["trails"],
  });
  const { action, isLoading } = useDataLayer({
    action: "saveTrail",
  });

  const { mutate, isPending: isPendingSaveTrail } = useMutation({
    mutationFn: async (trail: GeneratedTrail) => {
      if (!action) return;

      const { trail: savedTrail } = await action({ trail });

      return savedTrail;
    },
    onSuccess: () => {
      invalidate();
      onSuccess?.();
    },
  });

  return {
    mutate,
    isLoading: isLoading || isPendingSaveTrail,
  };
}
