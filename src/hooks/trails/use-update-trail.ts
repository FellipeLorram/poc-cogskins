import { TrailStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useDataLayer } from "../use-data-layer/use-data-layer";

interface Props {
  trailId: string;
  status: TrailStatus;
}

export function useUpdateTrail() {
  const { action, isLoading } = useDataLayer({
    action: "updateTrail",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ trailId, status }: Props) => {
      if (!action) return;

      const trail = await action({
        trailId,
        data: {
          status,
        },
      });

      return trail;
    },
  });

  return {
    mutate,
    isPending: isLoading || isPending,
  };
}
