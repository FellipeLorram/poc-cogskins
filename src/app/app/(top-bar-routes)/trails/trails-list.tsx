"use client";

import { Badge, badgeVariants } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { GeneratedTrail, TrailStatusMap } from "@/entities/trails";
import { useListTrails } from "@/hooks/trails/use-list-trails";
import { useTrailStore } from "@/stores/trail-store";
import { TrailStatus } from "@prisma/client";
import { VariantProps } from "class-variance-authority";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Filters = {
  search: string;
  level: number;
  status: TrailStatus;
};

export function TrailsList() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    level: 0,
    status: "IN_PROGRESS",
  });
  const { data: trails, isPending } = useListTrails();

  if (isPending || !trails) return <Loading />;

  const filteredTrails = trails
    .filter((trail) => {
      return trail.title.toLowerCase().includes(filters.search.toLowerCase());
    })
    .sort((a, b) => (b.badge?.level ?? 0) - (a.badge?.level ?? 0));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar trilha"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      {filteredTrails.length === 0 ? (
        <div className="text-center text-muted-foreground h-96 flex items-center justify-center">
          Nenhuma trilha encontrada
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {filteredTrails?.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </div>
      )}
    </div>
  );
}

function TrailCard({ trail }: { trail: GeneratedTrail }) {
  const { badges } = useTrailStore();
  const isBadgeUnlocked =
    badges.some((badgeId) => badgeId === trail?.badge?.id) ||
    trail?.badge?.userId !== null;

  let BadgeVariant: VariantProps<typeof badgeVariants>["variant"] = "secondary";
  let BadgeTitle = TrailStatusMap[trail.status];

  if (isBadgeUnlocked) {
    BadgeVariant = "success";
    BadgeTitle = `Nível ${trail.badge?.level}`;
  }

  if (trail.flag === "web-summit-2025") {
    BadgeTitle = "Web Summit 2025";
  }

  return (
    <Link
      href={`/app/trails/${trail.id}`}
      className="bg-background rounded-md p-6 border shadow-sm flex flex-col gap-2 relative"
    >
      <Image
        src={trail.badge?.url ?? ""}
        alt={trail.badge?.title ?? ""}
        width={1024}
        height={1024}
        data-unlocked={isBadgeUnlocked}
        className="w-full h-auto border rounded-md data-[unlocked=true]:border-green-500"
      />
      <Badge
        data-flag={trail.flag}
        variant={BadgeVariant}
        className="h-fit absolute top-2 right-2 data-[flag=web-summit-2025]:bg-[#ff4b07] data-[flag=web-summit-2025]:text-white"
      >
        {BadgeTitle}
      </Badge>
      <div className="flex gap-2 flex-1 justify-between">
        <h2 className="font-medium">{trail.title}</h2>
      </div>
      <div className="text-sm text-muted-foreground flex justify-between">
        <p>{trail.quests.length} Quests</p>
        <p>{trail.estimatedDuration} minutes</p>
      </div>
    </Link>
  );
}

function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="w-full h-10" />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-background rounded-md p-4 border shadow-sm flex flex-col gap-4 "
          >
            <Skeleton className="w-full h-40" />
            <div className="flex gap-2 flex-1 justify-between">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-16 h-4" />
            </div>
            <div className="text-sm text-muted-foreground">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-16 h-4 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
