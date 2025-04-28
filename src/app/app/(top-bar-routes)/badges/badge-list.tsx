"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useListBadges } from "@/hooks/badge/use-list-badges";
import { Badge as PrismaBadge } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

type Filters = {
  search: string;
  level: number;
};

export function BadgeList() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    level: 0,
  });
  const { data: badges, isPending } = useListBadges();

  if (isPending || !badges) return <Loading />;

  const filteredBadges = badges
    .filter((badge) => {
      return (
        badge.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.level > 0 ? badge.level === filters.level : true)
      );
    })
    .sort((a, b) => (b.level ?? 0) - (a.level ?? 0));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search badge"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      {filteredBadges.length === 0 ? (
        <div className="text-center text-muted-foreground h-96 flex items-center justify-center">
          No badges found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {filteredBadges?.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge }: { badge: PrismaBadge }) {
  return (
    <div className="relative p-6 bg-muted rounded-md w-96 max-w-full space-y-4 text-center border shadow data-[unlocked=false]:shadow-none data-[unlocked=false]:opacity-50 data-[unlocked=true]:border-green-500">
      <Badge className="absolute top-2 right-2">nível {badge.level}</Badge>

      <Image
        src={badge.url ?? ""}
        alt="Badge"
        width={1024}
        height={1024}
        className="w-full h-auto object-contain rounded-md"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">{badge.title}</p>
        <p className="text-sm text-muted-foreground">
          {badge.description ?? ""}
        </p>
      </div>
    </div>
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
