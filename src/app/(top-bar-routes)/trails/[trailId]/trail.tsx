"use client";

import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GeneratedQuest, QuestStatusMap } from "@/entities/quest";
import { TrailStatusMap } from "@/entities/trails";
import { useGetTrail } from "@/hooks/trails/use-get-trail";
import { QuestStatus } from "@prisma/client";
import { VariantProps } from "class-variance-authority";
import {
  ChevronRight,
  Lock,
  Share,
  Download,
  RefreshCcw,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  trailId: string;
}

export function Trail({ trailId }: Props) {
  const { data: trail, isPending } = useGetTrail({
    trailId,
  });

  const handleDownload = () => {
    if (!trail) return;

    const trailData = {
      title: trail.title,
      estimatedDuration: trail.estimatedDuration,
      quests: trail.quests.map((quest) => ({
        description: quest.description,
        questionsCount: quest.questions.length,
        attempts: quest.attempts,
        questions: quest.questions.map((question) => ({
          text: question.text,
          alternatives: question.alternatives,
          correctAnswer: question.correctAnswer,
          feedback: question.feedback,
        })),
      })),
    };

    const jsonString = JSON.stringify(trailData, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `trail-${trail.title.toLowerCase().replace(/\s+/g, "-")}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isPending || !trail) return <Loading />;

  return (
    <div className="w-full space-y-12">
      <div className="flex items-start justify-between w-full">
        <div>
          <h1 className="text-3xl">{trail.title}</h1>
          <div className="flex items-center w-fit gap-2 mt-1">
            <Badge variant="outline">{TrailStatusMap[trail.status]}</Badge>
            <p className="text-sm text-muted-foreground">
              Duração estimada: {trail.estimatedDuration} minutos
            </p>
          </div>
        </div>

        <div className="h-fit">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                disabled
                className="cursor-pointer"
                size="icon"
              >
                <Share className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Compartilhar</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="cursor-pointer"
                size="icon"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {trail.quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} trailId={trailId} />
        ))}
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
      className="flex items-center justify-between gap-2 border rounded-md px-4 h-24 shadow data-[locked=true]:opacity-70 data-[locked=true]:shadow-none"
    >
      <div className="flex flex-col gap-2">
        <p>{quest.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant}>{QuestStatusMap[quest.status]}</Badge>
          <p className="text-sm text-muted-foreground">
            {quest.questions.length} questões
          </p>
          <p className="text-sm text-muted-foreground">{attempts} tentativas</p>
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

        <div className="h-fit flex items-center gap-2">
          <Skeleton className="w-9 h-9" />
          <Skeleton className="w-9 h-9" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 border rounded-md px-4 h-24"
          >
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
        ))}
      </div>
    </div>
  );
}
