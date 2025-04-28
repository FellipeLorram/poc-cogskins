import { updateBadge } from "@/api/badge/update-badge";
import { useMutation } from "@tanstack/react-query";
import { useSessionUser } from "../auth/use-session-user";
import { useInvalidateQuery } from "../use-invalidate-query";

interface Props {
  badgeId: string;
  level: number;
}

export function useUpdateBadge() {
  const { invalidate } = useInvalidateQuery({
    queryKey: ["badges"],
  });
  const { data: user } = useSessionUser();
  return useMutation({
    mutationFn: async ({ badgeId, level }: Props) => {
      if (user) await updateBadge({ badgeId, level });
    },
    onSuccess: async () => {
      await invalidate();
    },
  });
}
