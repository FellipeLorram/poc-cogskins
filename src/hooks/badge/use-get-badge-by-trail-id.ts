import { getBadgeByTrailId } from "@/api/badge/get-badge-by-trail-id";
import { useQuery } from "@tanstack/react-query";
import { useTrailStore } from "@/stores/trail-store";
interface Props {
  trailId: string;
}

export function useGetBadgeByTrailId({ trailId }: Props) {
  const { getBadgeByTrailId: getBadgeByTrailIdFromStore } = useTrailStore();

  return useQuery({
    queryKey: ["badge", trailId],
    queryFn: async () => {
      const badge = await getBadgeByTrailId(trailId);

      if (badge) return badge;

      return getBadgeByTrailIdFromStore(trailId);
    },
  });
}
