"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSessionUser } from "@/hooks/auth/use-session-user";
import { useGetBadgeByFlag } from "@/hooks/badge/use-get-badge-by-flag";
import { useListCompletedWebSummitQuests } from "@/hooks/quests/use-list-completed-websummit-quests";
import { useRouter } from "next/navigation";
import { dataStore } from "../../data-store";
import { useStore } from "../../store";
import { Quest, TrailId, Trail as TrailType } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
interface Props {
  trail: TrailType;
}

export function Trail({ trail }: Props) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {trail.quests.map((quest) => (
        <QuestCard quest={quest} trailId={trail.id} key={quest.type} />
      ))}
    </div>
  );
}

interface QuestCardProps {
  quest: Quest;
  trailId: TrailId;
}

function QuestCard({ quest, trailId }: QuestCardProps) {
  const router = useRouter();

  const { isCompleted, isPending } = useIsQuestStatus(trailId, quest.type);

  const firstQuestion = quest.questions[0];

  function handleStartQuest() {
    if (isCompleted) {
      return router.push(`/app/pet/trails/${trailId}/${quest.type}/completed`);
    }

    router.push(`/app/pet/trails/${trailId}/${quest.type}/${firstQuestion.id}`);
  }

  if (isPending) return <Skeleton className="w-full h-20" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quest: {quest.name}</CardTitle>
        <CardDescription>{quest.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={handleStartQuest}>
          {isCompleted ? "Completed" : "Start"}
        </Button>
      </CardFooter>
    </Card>
  );
}

interface UseIsQuestStatusResult {
  isPending: boolean;
  isCompleted: boolean;
}

function useIsQuestStatus(
  trailId: TrailId,
  questType: string
): UseIsQuestStatusResult {
  const { data: sessionUser, isPending } = useSessionUser();
  const { data: badge, isPending: isBadgePending } = useGetBadgeByFlag({
    flag: "pet",
  });
  const { data: completedQuests, isPending: isCompletedQuestsPending } =
    useListCompletedWebSummitQuests();

  const quest = dataStore.getQuestByType(trailId, questType) as Quest;

  const { isQuestCompleted } = useStore();

  if (isPending || isBadgePending || isCompletedQuestsPending) {
    return {
      isPending: true,
      isCompleted: false,
    };
  }
  if (!sessionUser || !badge) {
    return {
      isPending: false,
      isCompleted: isQuestCompleted(quest?.id ?? ""),
    };
  }

  const hasDBCompletedQuest = completedQuests?.find(
    (completedQuest) => completedQuest.id === quest?.id
  );

  return {
    isPending: false,
    isCompleted: !!hasDBCompletedQuest,
  };
}
