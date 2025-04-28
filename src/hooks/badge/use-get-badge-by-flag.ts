import { getBadgeByFlag } from "@/api/badge/get-badge-by-flag";
import { useQuery } from "@tanstack/react-query";

interface Props {
  flag: string;
}

export function useGetBadgeByFlag({ flag }: Props) {
  return useQuery({
    queryKey: ["badge", flag],
    queryFn: () => getBadgeByFlag(flag),
  });
}
