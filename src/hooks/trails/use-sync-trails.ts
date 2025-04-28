"use client";

import { useMutation } from "@tanstack/react-query";
import { useTrailStore } from "@/stores/trail-store";
import { syncContents } from "@/api/helpers/sync-contents";
import { toast } from "sonner";
import { useInvalidateQuery } from "../use-invalidate-query";
import { useStore as useWebSummitStore } from "@/app/app/(no-top-bar-routes)/web-summit/store";

export function useSyncContents() {
  const { invalidate } = useInvalidateQuery({
    queryKey: ["trails", "badges"],
  });
  const { trails, badges, clearTrails, clearBadges } = useTrailStore();
  const { level, setCompletedAnyQuest, completedAnyQuest, completedQuests } =
    useWebSummitStore();

  return useMutation({
    mutationFn: async () => {
      if (completedAnyQuest) {
        console.log("completedAnyQuest", completedAnyQuest);
        return await syncContents({
          trails,
          badges,
          webSummitBadgeLevel: level,
          completedQuests: completedQuests.map((quest) => quest.questType),
        });
      }
      return syncContents({
        trails,
        badges,
        completedQuests: completedQuests.map((quest) => quest.questType),
      });
    },
    onSuccess: () => {
      clearTrails();
      clearBadges();
      invalidate();
      setCompletedAnyQuest(false);
    },
    onError: (error) => {
      toast.error(`Falha na sincronização: ${error.message}`);
    },
  });
}
