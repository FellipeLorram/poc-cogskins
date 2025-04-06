import { listUserBadges } from "@/api/badge/list-user-badges";
import { useTrailStore } from "@/stores/trail-store";
import { Badge } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useListBadges() {
  const { listBadges } = useTrailStore();

  return useQuery<Badge[]>({
    queryKey: ["badges"],
    queryFn: async () => {
      const badges = await listUserBadges();
      if (badges) return badges;
      return listBadges();
    },
  });
}
