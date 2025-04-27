"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
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
  const { isQuestLocked, isQuestCompleted } = useStore();
  const router = useRouter();

  const isLocked = isQuestLocked(trailId, quest.type);
  const isCompleted = isQuestCompleted(quest.type);

  const firstQuestion = quest.questions[0];

  function handleStartQuest() {
    if (isLocked) return;

    if (isCompleted) {
      return router.push(
        `/web-summit/trails/${trailId}/quests/${quest.type}/completed`
      );
    }

    router.push(
      `/web-summit/trails/${trailId}/${quest.type}/${firstQuestion.id}`
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quest: {quest.name}</CardTitle>
        <CardDescription>{quest.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={handleStartQuest}>Start</Button>
      </CardFooter>
    </Card>
  );
}
