import { useTrailStore } from "@/stores/trail-store";
import { useQuery } from "@tanstack/react-query";
import { getQuestByDifficulty as getQuestByDifficultyServer } from "@/api/quest/get-quest-by-difficulty";

interface Props {
  trailId: string;
  difficulty: number;
  enabled?: boolean;
}

export function useGetQuestByDifficulty({
  trailId,
  difficulty,
  enabled = true,
}: Props) {
  const { getQuestByDifficulty } = useTrailStore();

  return useQuery({
    queryKey: ["quest", trailId, difficulty.toString()],
    queryFn: async () => {
      const { quest } = await getQuestByDifficultyServer({
        trailId,
        difficulty,
      });

      if (!quest) return getQuestByDifficulty(trailId, difficulty);

      return quest;
    },
    enabled,
  });
}
