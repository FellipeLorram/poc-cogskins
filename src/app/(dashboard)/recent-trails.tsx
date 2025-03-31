"use client";

import { useListTrails } from "@/hooks/trails/use-list-trails";
import { GeneratedTrail } from "@/entities/trails";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TrailStatus } from "@prisma/client";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentTrails() {
  const { data: trails, isPending } = useListTrails();

  if (isPending) return <TrailCardSkeleton />;

  if (!trails || trails.length === 0) return <div className="h-32" />;

  const recentTrails = trails?.slice(0, 6);

  return (
    <div className="flex flex-col gap-6 w-full h-32">
      <h1 className="text-sm font-medium">Recentes</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {recentTrails?.map((trail) => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </div>
  );
}

const TrailStatusMap: Record<TrailStatus, string> = {
  DRAFT: "Rascunho",
  COMPLETED: "Concluído",
  IN_PROGRESS: "Em andamento",
};

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-background flex gap-2 shadow-sm relative border rounded-md p-2"
          >
            <Skeleton className="w-16 h-16" />
            <div className="flex flex-col">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
