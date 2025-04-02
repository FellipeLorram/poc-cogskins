import { useTrailStore } from "@/stores/trail-store";
import { useQuery } from "@tanstack/react-query";
import { getTrail as getTrailServer } from "@/api/trails/get-trail";

interface Props {
  trailId: string;
}

export function useGetTrail({ trailId }: Props) {
  const { getTrail } = useTrailStore();

  return useQuery({
    queryKey: ["trail", trailId],
    queryFn: async () => {
      const { trail } = await getTrailServer({ trailId });

      if (!trail) return getTrail(trailId);

      return trail;
    },
  });
}
