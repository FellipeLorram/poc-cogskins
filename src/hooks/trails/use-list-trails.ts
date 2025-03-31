"use client";

import { useQuery } from "@tanstack/react-query";
import { useTrailStore } from "@/stores/trail-store";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { listTrails } from "@/api/trails/list-trails";
import { GeneratedTrail } from "@/entities/trails";

export function useListTrails() {
  const { data: user, isLoading: isSessionLoading } = useSessionUser();
  const { trails } = useTrailStore();

  return useQuery<GeneratedTrail[]>({
    queryKey: ["trails", !!user], // Refetch when user auth state changes
    queryFn: async () => {
      if (user) {
        // User is logged in, fetch from the database
        return (await listTrails()) as GeneratedTrail[];
      } else {
        // No user session, return trails from the store
        return trails as GeneratedTrail[];
      }
    },
    // Don't run the query until we know if the user is logged in or not
    enabled: !isSessionLoading,
    // Initial data from the store (useful for both authenticated and non-authenticated users)
    initialData: trails as GeneratedTrail[],
  });
}
