import { useQuery } from "@tanstack/react-query";
import { useTrailStore } from "@/stores/trail-store";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { listTrails } from "@/api/trails/list-trails";
import { GeneratedTrail } from "@/entities/trails";
import { useEffect, useState } from "react";

export function useListTrails() {
  const { data: user, isLoading: isSessionLoading } = useSessionUser();
  const { trails } = useTrailStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return useQuery<GeneratedTrail[]>({
    queryKey: ["trails"],
    queryFn: async () => {
      if (user) return (await listTrails()) as GeneratedTrail[];
      return trails as GeneratedTrail[];
    },
    enabled: !isSessionLoading && isHydrated,
    initialData: trails as GeneratedTrail[],
  });
}
