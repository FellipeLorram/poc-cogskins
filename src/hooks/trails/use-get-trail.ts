import { useTrailStore } from "@/stores/trail-store";
import { useQuery } from "@tanstack/react-query";
import { getTrail as getTrailServer } from "@/api/trails/get-trail";

interface Props {
  trailId: string;
  flag?: string;
}

export function useGetTrail({ trailId, flag }: Props) {
  const { getTrail } = useTrailStore();

  return useQuery({
    queryKey: ["trail", trailId],
    queryFn: async () => {
      const { trail } = await getTrailServer({ trailId, flag });

      if (!trail) return getTrail(trailId);

      return trail;
    },
  });
}
