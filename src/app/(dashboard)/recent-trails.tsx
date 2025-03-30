"use client";

import { useListTrails } from "@/hooks/trails/use-list-trails";
import { GeneratedTrail } from "@/entities/trails";
import Image from "next/image";

export function RecentTrails() {
  const { data: trails, isPending } = useListTrails();

  const recentTrails = trails?.slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-sm font-medium">Recentes</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {recentTrails?.map((trail) => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </div>
  );
}

function TrailCard({ trail }: { trail: GeneratedTrail }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <Image
        src={trail.badge?.url ?? ""}
        alt={trail.badge?.title ?? ""}
        width={100}
        height={100}
      />
      <h2 className="text-lg font-medium">{trail.title}</h2>
    </div>
  );
}
