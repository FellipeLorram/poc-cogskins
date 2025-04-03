import { updateTrail as updateTrailServer } from "@/api/trails/update-trail";
import { useTrailStore } from "@/stores/trail-store";
import { TrailStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

interface Props {
  trailId: string;
  status: TrailStatus;
}

export function useUpdateTrail() {
  const { updateTrail } = useTrailStore();

  return useMutation({
    mutationFn: async ({ trailId, status }: Props) => {
      const trail = await updateTrailServer({
        trailId,
        trailStatus: status,
      });

      if (!trail) updateTrail(trailId, status);
    },
  });
}
