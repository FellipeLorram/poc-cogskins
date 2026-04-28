import { getQuest as getQuestServer } from "@/api/quest/get-quest";
import { useTrailStore } from "@/stores/trail-store";
import { useQuery } from "@tanstack/react-query";

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

// export function useGetQuest({ trailId, questId }: Props) {
//   const { action, isLoading } = useDataContext({
//     action: "get-quest",
//   });

//   const { data: quest, isPending: isPendingQuest } = useQuery({
//     queryKey: ["quest", trailId, questId],
//     queryFn: async () => {
//       const { quest } = await action(trailId, questId);

//       return quest;
//     },
//   });

// }

// const serverActions = {
//   "get-quest": getQuestServer,
// };

// const clientActions = {
//   "get-quest": getQuest,
// };

// function useDataContext({ action }: { action: string }) {
//   const { data: user, isLoading: isLoadingUser } = useSessionUser();

//   if (isLoadingUser)
//     return {
//       isLoading: true,
//       action: null,
//     };

//   if (!user) {
//     return {
//       isLoading: false,
//       action: clientActions[action],
//     };
//   }

//   return { isLoading: false, action: serverActions[action] };
// }
