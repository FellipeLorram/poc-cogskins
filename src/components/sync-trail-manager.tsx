"use client";

import { useEffect, useRef } from "react";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { useSyncTrails } from "@/hooks/trails/use-sync-trails";
import { useTrailStore } from "@/stores/trail-store";

export function TrailSyncManager() {
  const { data: user, isLoading } = useSessionUser();
  const { mutate: syncTrails, isPending } = useSyncTrails();
  const { trails } = useTrailStore();

  // Referência para controlar se já sincronizamos
  const hasSynced = useRef(false);

  useEffect(() => {
    // Se o usuário está logado, não estamos carregando,
    // existem trilhas para sincronizar e ainda não sincronizamos
    if (
      user &&
      !isLoading &&
      trails.length > 0 &&
      !hasSynced.current &&
      !isPending
    ) {
      // Marcar que já iniciamos a sincronização
      hasSynced.current = true;

      // Executar a sincronização
      syncTrails();
    }

    // Se o usuário deslogar, resetamos o estado
    if (!user && !isLoading) {
      hasSynced.current = false;
    }
  }, [user, isLoading, trails.length, syncTrails, isPending]);

  // Componente não renderiza nada visualmente
  return null;
}
