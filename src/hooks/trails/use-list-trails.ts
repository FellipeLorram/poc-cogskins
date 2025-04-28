import { listTrails } from "@/api/trails/list-trails";
import { GeneratedTrail } from "@/entities/trails";
import { useTrailStore } from "@/stores/trail-store";
import { useQuery } from "@tanstack/react-query";

export function useListTrails() {
  const { trails } = useTrailStore();

  const { data: dbTrails, isPending: isDbTrailsLoading } = useQuery<
    GeneratedTrail[]
  >({
    queryKey: ["trails"],
    queryFn: async () => {
      const dbTrails = (await listTrails()) as GeneratedTrail[];
      if (dbTrails.length === 0) return trails;
      return dbTrails;
    },
  });

  return {
    data: dbTrails ?? trails,
    isPending: isDbTrailsLoading,
  };
}
