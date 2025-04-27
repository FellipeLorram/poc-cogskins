"use client";

import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GeneratedQuest, QuestStatusMap } from "@/entities/quest";
import { TrailStatusMap } from "@/entities/trails";
import { useGetTrail } from "@/hooks/trails/use-get-trail";
import { BadgeStatus, QuestStatus } from "@prisma/client";
import { VariantProps } from "class-variance-authority";
import { ChevronRight, Eye, Lock, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  trailId: string;
  flag?: string;
}

export function Trail({ trailId, flag }: Props) {
  const { data: trail, isPending } = useGetTrail({
    trailId,
    flag,
  });

  if (isPending || !trail) return <Loading />;

  const isBadgeUnlocked = trail.badge?.status === BadgeStatus.UNLOCKED;

  return (
    <div className="w-full space-y-12">
      <div className="flex items-start justify-between w-full">
        <div>
          <h1 className="text-2xl md:text-3xl">{trail.title}</h1>
          <div className="flex items-center w-fit gap-2 mt-1">
            <Badge variant="outline">{TrailStatusMap[trail.status]}</Badge>
            <p className="text-sm text-muted-foreground">
              Estimated duration: {trail.estimatedDuration} minutes
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {trail.quests.map((quest) => (
          <div
            className="w-full flex flex-col gap-4 items-center justify-center"
            key={quest.id}
          >
            <QuestCard quest={quest} trailId={trailId} />
            <div className="h-8 border-r border-dashed" />
          </div>
        ))}

        <div className="w-full flex items-center justify-center">
          <div
            data-unlocked={isBadgeUnlocked}
            className="p-6 bg-muted rounded-md w-96 max-w-full space-y-4 text-center border shadow data-[unlocked=false]:shadow-none data-[unlocked=false]:opacity-50 data-[unlocked=true]:border-green-500"
          >
            {isBadgeUnlocked && (
              <p>
                Conquered {trail.badge?.title} level {trail.badge?.level}
              </p>
            )}
            <Image
              src={trail.badge?.url ?? ""}
              alt="Badge"
              width={1024}
              height={1024}
              className="w-full h-auto object-contain rounded-md"
            />
            <p className="text-sm text-muted-foreground">
              {trail.badge?.description ?? ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuestCardProps {
  quest: GeneratedQuest;
  trailId: string;
}

function QuestCard({ quest, trailId }: QuestCardProps) {
  const router = useRouter();

  const isLocked = quest.status === QuestStatus.LOCKED;
  const isCompleted = quest.status === QuestStatus.COMPLETED;
  const attempts = quest.attempts;
  let badgeVariant: VariantProps<typeof badgeVariants>["variant"] = "outline";

  if (quest.status === QuestStatus.IN_PROGRESS) {
    badgeVariant = "inProgress";
  } else if (quest.status === QuestStatus.COMPLETED) {
    badgeVariant = "success";
  }

  const firstQuestion = quest.questions[0];

  function handleStartQuest() {
    if (isLocked) return;

    if (isCompleted) {
      return router.push(`/trails/${trailId}/quests/${quest.id}/completed`);
    }

    router.push(
      `/trails/${trailId}/quests/${quest.id}?questionId=${firstQuestion.id}`
    );
  }

  let buttonText = "Iniciar";
  let buttonIcon = <ChevronRight className="w-4 h-4" />;

  if (isLocked) {
    buttonText = "";
    buttonIcon = <Lock className="w-4 h-4" />;
  } else if (isCompleted) {
    buttonText = "Ver resultado";
    buttonIcon = <Eye className="w-4 h-4" />;
  } else if (attempts > 0) {
    buttonText = "Tentar novamente";
    buttonIcon = <RefreshCcw className="w-4 h-4" />;
  }

  return (
    <div
      data-locked={isLocked}
      className="w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 border rounded-md px-4 py-4 md:py-0 md:h-24 shadow data-[locked=true]:opacity-70 data-[locked=true]:shadow-none"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm md:text-base">Quest: {quest.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant}>
            {QuestStatusMap[quest.status]}
            {quest.completedAt && (
              <span className="text-xs">
                {quest.completedAt.toLocaleDateString()}
              </span>
            )}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {quest.questions.length} questions
          </p>
          <p className="text-sm text-muted-foreground">{attempts} attempts</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled={isLocked}
          variant="outline"
          className="cursor-pointer"
          onClick={handleStartQuest}
        >
          {buttonText}
          {buttonIcon}
        </Button>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="w-full space-y-12">
      <div className="flex items-start justify-between w-full">
        <div>
          <Skeleton className="w-64 h-8" />

          <div className="flex items-center w-fit gap-2 mt-1">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-full flex flex-col gap-4 items-center justify-center"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 border rounded-md px-4 py-4 md:py-0 md:h-24 w-full">
              <div className="flex flex-col gap-2">
                <Skeleton className="w-64 h-4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-16 h-4" />
                  <Skeleton className="w-16 h-4" />
                  <Skeleton className="w-16 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-16 h-9" />
              </div>
            </div>
            <div className="h-8 border-r border-dashed" />
          </div>
        ))}
      </div>
    </div>
  );
}
