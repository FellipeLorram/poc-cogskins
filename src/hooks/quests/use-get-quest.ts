import { useTrailStore } from "@/stores/trail-store";
import { useQuery } from "@tanstack/react-query";
import { getQuest as getQuestServer } from "@/api/quest/get-quest";

interface Props {
  trailId: string;
  questId: string;
}

export function useGetQuest({ trailId, questId }: Props) {
  const { getQuest } = useTrailStore();

  return useQuery({
    queryKey: ["quest", trailId, questId],
    queryFn: async () => {
      const { quest } = await getQuestServer({ trailId, questId });

      if (!quest) return getQuest(trailId, questId);

      return quest;
    },
  });
}
