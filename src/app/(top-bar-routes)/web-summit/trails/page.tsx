import { listWebSummit2025Trails } from "@/api/web-summit-2025/list-trails";
import { TrailList } from "./trail-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CardTitle } from "@/components/ui/card";

export default async function Page() {
  const trailsListPromise = listWebSummit2025Trails();

  return (
    <div className="mt-20 w-full flex flex-col gap-8">
      <CardTitle>Exclusive Web Summit 2025 Trails</CardTitle>
      <Suspense fallback={<Loading />}>
        <TrailList trailListPromise={trailsListPromise} />
      </Suspense>
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
