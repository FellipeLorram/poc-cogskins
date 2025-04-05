import { useMutation } from "@tanstack/react-query";
import { addBadgeToUser } from "@/api/badge/add-badge-to-user";
import { useInvalidateQuery } from "../use-invalidate-query";
import { useSessionUser } from "../auth/use-session-user";
import { useTrailStore } from "@/stores/trail-store";

interface Props {
  badgeId: string;
}

export function useEarnBadge() {
  const { invalidate } = useInvalidateQuery({
    queryKey: ["badges"],
  });
  const { data: user } = useSessionUser();
  const { addBadge } = useTrailStore();
  return useMutation({
    mutationFn: async ({ badgeId }: Props) => {
      if (user) await addBadgeToUser({ userId: user.id, badgeId });
      else addBadge(badgeId);
    },
    onSuccess: () => {
      invalidate();
    },
  });
}
