import { useQuery } from "@tanstack/react-query";
import { useTrailStore } from "@/stores/trail-store";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { listTrails } from "@/api/trails/list-trails";
import { GeneratedTrail } from "@/entities/trails";

export function useListTrails() {
  const { data: user, isPending: isSessionLoading } = useSessionUser();
  const { trails } = useTrailStore();

  const { data: dbTrails, isPending: isDbTrailsLoading } = useQuery<
    GeneratedTrail[]
  >({
    queryKey: ["trails"],
    queryFn: async () => {
      if (user) return (await listTrails()) as GeneratedTrail[];
      return trails;
    },
    enabled: !isSessionLoading,
  });

  return {
    data: dbTrails ?? trails,
    isPending: isSessionLoading || isDbTrailsLoading,
  };
}
