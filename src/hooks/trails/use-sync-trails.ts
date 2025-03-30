"use client";

import { useMutation } from "@tanstack/react-query";
import { useTrailStore } from "@/stores/trail-store";
import { syncTrails } from "@/api/trails/sync-trails";
import { toast } from "sonner";

export function useSyncTrails() {
  const { trails, clearTrails } = useTrailStore();

  return useMutation({
    mutationFn: async () => {
      if (trails.length > 0) {
        return await syncTrails(trails);
      }
      return { success: true, message: "Nenhuma trilha para sincronizar." };
    },
    onSuccess: (result) => {
      if (result.success) {
        clearTrails();
      } else if (result.error) {
        toast.error(`Erro na sincronização: ${result.error}`);
      }
    },
    onError: (error) => {
      toast.error(`Falha na sincronização: ${error.message}`);
    },
  });
}
