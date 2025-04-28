import { listCompleteWebSummitQuest } from "@/api/quest/list-complete-websummit-quest";
import { useQuery } from "@tanstack/react-query";

export function useListCompletedWebSummitQuests() {
  return useQuery({
    queryKey: ["completed-quests"],
    queryFn: () => listCompleteWebSummitQuest(),
  });
}
