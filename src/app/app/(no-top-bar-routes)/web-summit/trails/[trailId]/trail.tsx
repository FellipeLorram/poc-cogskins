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
import { useRouter } from "next/navigation";
import { dataStore } from "../../data-store";
import { useStore } from "../../store";
import { Quest, TrailId, Trail as TrailType } from "../../types";

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

  const { isCompleted } = useIsQuestStatus(trailId, quest.type);

  const firstQuestion = quest.questions[0];

  function handleStartQuest() {
    if (isCompleted) {
      return router.push(
        `/app/web-summit/trails/${trailId}/${quest.type}/completed`
      );
    }

    router.push(
      `/app/web-summit/trails/${trailId}/${quest.type}/${firstQuestion.id}`
    );
  }

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
  isLocked: boolean;
  isCompleted: boolean;
}

function useIsQuestStatus(
  trailId: TrailId,
  questType: string
): UseIsQuestStatusResult {
  const { data: sessionUser, isPending } = useSessionUser();
  const { data: badge, isPending: isBadgePending } = useGetBadgeByFlag({
    flag: "web-summit-2025",
  });

  const { isQuestLocked, isQuestCompleted } = useStore();

  if (isPending || isBadgePending) {
    return {
      isLocked: isQuestLocked(trailId, questType),
      isCompleted: isQuestCompleted(questType),
    };
  }

  if (!sessionUser || !badge) {
    return {
      isLocked: isQuestLocked(trailId, questType),
      isCompleted: isQuestCompleted(questType),
    };
  }

  const quest = dataStore.getQuestByType(trailId, questType) as Quest;
  const isLocked = quest?.level > badge?.level;
  const isCompleted = isQuestCompleted(quest?.id ?? "");

  return { isLocked, isCompleted };
}
