import { createWebsummit2025Badge } from "@/api/badge/create-websummit-2025-badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateWeb2025Badge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWebsummit2025Badge,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["badge", "web-summit-2025"],
      });
    },
  });
}
