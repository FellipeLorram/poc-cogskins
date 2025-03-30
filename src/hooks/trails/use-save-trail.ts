"use client";

import { useMutation } from "@tanstack/react-query";
import { useTrailStore } from "@/stores/trail-store";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { saveTrail } from "@/api/trails/save-trail";
import { Prisma } from "@prisma/client";

type GeneratedTrail = Prisma.TrailGetPayload<{
  include: {
    inputContents: true;
    quests: true;
    badge: true;
  };
}>;

export function useSaveTrail() {
  const { data: user } = useSessionUser();
  const { addTrail } = useTrailStore();

  return useMutation({
    mutationFn: async (trail: GeneratedTrail) => {
      if (user) await saveTrail(trail);
      else addTrail(trail);
    },
  });
}
