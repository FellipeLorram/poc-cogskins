"use client";

import { useMutation } from "@tanstack/react-query";
import { useTrailStore } from "@/stores/trail-store";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { saveTrail } from "@/api/trails/save-trail";
import { GeneratedTrail } from "@/entities/trails";
import { useInvalidateQuery } from "../use-invalidate-query";

interface Props {
  onSuccess?: () => void;
}

export function useSaveTrail({ onSuccess }: Props) {
  const { invalidate } = useInvalidateQuery({
    queryKey: ["trails"],
  });
  const { data: user } = useSessionUser();
  const { addTrail } = useTrailStore();

  return useMutation({
    mutationFn: async (trail: GeneratedTrail) => {
      if (user) await saveTrail(trail);
      else addTrail(trail);
    },
    onSuccess: () => {
      invalidate();
      onSuccess?.();
    },
  });
}
