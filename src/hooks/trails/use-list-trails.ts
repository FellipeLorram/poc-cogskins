import { ListTrailsResponse } from "@/entities/trail-actions";
import { useQuery } from "@tanstack/react-query";
import { useDataLayer } from "../use-data-layer/use-data-layer";

export function useListTrails() {
  const { action, isLoading } = useDataLayer({
    action: "listTrails",
  });

  const { data, isPending: isDbTrailsLoading } = useQuery<ListTrailsResponse>({
    queryKey: ["trails"],
    queryFn: async () => {
      if (!action) return { trails: [] };

      const trails = await action();

      return trails;
    },
  });

  return {
    data,
    isPending: isDbTrailsLoading || isLoading,
  };
}
