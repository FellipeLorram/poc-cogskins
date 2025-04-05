"use client";

import { useMutation } from "@tanstack/react-query";
import { useTrailStore } from "@/stores/trail-store";
import { syncContents } from "@/api/helpers/sync-contents";
import { toast } from "sonner";
import { useInvalidateQuery } from "../use-invalidate-query";

export function useSyncContents() {
  const { invalidate } = useInvalidateQuery({
    queryKey: ["trails", "badges"],
  });
  const { trails, badges, clearTrails, clearBadges } = useTrailStore();

  return useMutation({
    mutationFn: async () => {
      if (trails.length > 0) {
        return await syncContents({ trails, badges });
      }
      return { success: true, message: "Nenhuma trilha para sincronizar." };
    },
    onSuccess: (result) => {
      if (result.success) {
        clearTrails();
        clearBadges();
        invalidate();
      } else if (result.error) {
        toast.error(`Erro na sincronização: ${result.error}`);
      }
    },
    onError: (error) => {
      toast.error(`Falha na sincronização: ${error.message}`);
    },
  });
}
