import { updateQuest as updateQuestServer } from "@/api/quest/update-quest";
import { useTrailStore } from "@/stores/trail-store";
import { QuestStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

interface Props {
  trailId: string;
  questId: string;
  status: QuestStatus;
  attempts: number;
}

export function useUpdateQuest() {
  const { updateQuest } = useTrailStore();

  return useMutation({
    mutationFn: async ({ trailId, questId, status, attempts }: Props) => {
      const quest = await updateQuestServer({
        questId,
        status,
        attempts,
      });

      if (!quest) updateQuest(trailId, questId, status, attempts);
    },
  });
}
