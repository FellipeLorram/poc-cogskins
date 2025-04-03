"use client";

import { Badge } from "@/components/ui/badge";
import { GeneratedTrail, TrailStatusMap } from "@/entities/trails";
import { useListTrails } from "@/hooks/trails/use-list-trails";
import Image from "next/image";
import Link from "next/link";

export function TrailsList() {
  const { data: trails, isPending } = useListTrails();

  if (isPending || !trails) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {trails?.map((trail) => <TrailCard key={trail.id} trail={trail} />)}
    </div>
  );
}

function TrailCard({ trail }: { trail: GeneratedTrail }) {
  return (
    <Link
      href={`/trails/${trail.id}`}
      className="bg-background rounded-md p-4 border shadow-sm flex flex-col gap-4 "
    >
      <Image
        src={trail.badge?.url ?? ""}
        alt={trail.badge?.title ?? ""}
        width={1024}
        height={1024}
        className="w-full h-auto"
      />
      <div className="flex gap-2 flex-1">
        <h2 className="text-lg font-medium">{trail.title}</h2>
        <Badge variant="outline" className="h-fit">
          {TrailStatusMap[trail.status]}
        </Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>{trail.quests.length} Quests</p>
        <p>Duração estimada: {trail.estimatedDuration} minutos</p>
      </div>
    </Link>
  );
}
