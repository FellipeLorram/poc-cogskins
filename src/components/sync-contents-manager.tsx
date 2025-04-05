"use client";

import { useEffect, useRef } from "react";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { useSyncContents } from "@/hooks/trails/use-sync-trails";
import { useTrailStore } from "@/stores/trail-store";

export function SyncContentsManager() {
  const { data: user, isPending: isUserPending } = useSessionUser();
  const { mutate: syncContents, isPending } = useSyncContents();
  const { trails } = useTrailStore();

  // Referência para controlar se já sincronizamos
  const hasSynced = useRef(false);

  useEffect(() => {
    // Se o usuário está logado, não estamos carregando,
    // existem trilhas para sincronizar e ainda não sincronizamos
    if (
      user &&
      !isUserPending &&
      trails.length > 0 &&
      !hasSynced.current &&
      !isPending
    ) {
      // Marcar que já iniciamos a sincronização
      hasSynced.current = true;

      // Executar a sincronização
      syncContents();
    }

    // Se o usuário deslogar, resetamos o estado
    if (!user && !isUserPending) {
      hasSynced.current = false;
    }
  }, [user, isUserPending, trails.length, syncContents, isPending]);

  // Componente não renderiza nada visualmente
  return null;
}
