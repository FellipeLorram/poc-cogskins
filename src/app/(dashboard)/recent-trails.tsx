"use client";

import { generateTrailTaskTrigger } from "@/api/trails/generate-trail-task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GeneratedTrail, TrailStatusMap } from "@/entities/trails";
import { useListTrails } from "@/hooks/trails/use-list-trails";
import { useSaveTrail } from "@/hooks/trails/use-save-trail";
import { Info, Loader2, RefreshCcw, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useTrailRunnerStore } from "./trail-runner-store";
import { useRealtimeRunner } from "./use-realtime-runner";

export function RecentTrails() {
  const { data: trails, isPending } = useListTrails();
  const { runId, accessToken, setRunId, setAccessToken } =
    useTrailRunnerStore();

  const { isGenerating, error, trail } = useRealtimeRunner({
    accessToken: accessToken ?? undefined,
    runId: runId ?? undefined,
  });

  const { mutate: saveTrail } = useSaveTrail({
    onSuccess: () => {
      setRunId(null);
      setAccessToken(null);
    },
  });
  console.log("trails", trails);
  const recentTrails =
    isGenerating || error ? trails?.slice(0, 5) : trails?.slice(0, 6);

  const showTitle = isGenerating || error || trails?.length > 0;

  useEffect(() => {
    if (error) return;
    if (!trail) return;

    saveTrail(trail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, trail]);

  if (isPending) return <TrailCardSkeleton />;

  return (
    <div className="flex flex-col gap-6 h-32 w-full">
      {showTitle && <h1 className="text-sm font-medium">Recentes</h1>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {isGenerating && <GeneratingTrailCard />}
        <ErrorTrailCard error={error} />
        {recentTrails?.map((trail) => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </div>
  );
}

function TrailCard({ trail }: { trail: GeneratedTrail }) {
  return (
    <Link
      href={`/trails/${trail.id}`}
      className="bg-background flex gap-2 h-24 shadow-sm relative border rounded-md p-2"
    >
      <Image
        src={trail.badge?.url ?? ""}
        alt={trail.badge?.title ?? ""}
        width={1024}
        height={1024}
        className="w-16 h-16"
      />
      <Badge variant="outline" className="absolute bottom-2 right-2">
        {TrailStatusMap[trail.status]}
      </Badge>
      <div className="flex flex-col">
        <h2 className="text-sm font-medium">{trail.title}</h2>
      </div>
    </Link>
  );
}

function TrailCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full h-32">
      <h1 className="text-sm font-medium">Recentes</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-background flex gap-2 shadow-sm relative border rounded-md p-2 h-24"
          >
            <Skeleton className="w-16 h-16" />
            <div className="flex flex-col">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-16 h-2 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeneratingTrailCard() {
  return (
    <div className="bg-accent animate-pulse flex items-center justify-center gap-2 h-24 shadow-sm relative border rounded-md p-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <p className="text-xs w-fit">
        Gerando trilha, isso pode levar alguns segundos...
      </p>
    </div>
  );
}

function ErrorTrailCard({ error }: { error: string | null }) {
  const { contents, setAccessToken, setRunId, setContents } =
    useTrailRunnerStore();

  async function handleTryAgain() {
    const { runId, accessToken } = await generateTrailTaskTrigger({
      contents,
    });

    setRunId(runId);
    setAccessToken(accessToken);
  }

  function handleDelete() {
    setAccessToken(null);
    setRunId(null);
    setContents([]);
  }

  if (!error || !contents.length) return null;

  return (
    <div className="bg-red-500/5 border-red-300 flex flex-col items-center justify-center gap-2 h-24 shadow-sm relative border rounded-md p-2">
      <div className="flex w-full items-center justify-center gap-2">
        <p className="text-xs w-fit">Erro ao gerar trilha</p>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>{error}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              size="sm"
              onClick={handleTryAgain}
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tentar novamente</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              size="sm"
              onClick={handleDelete}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deletar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
