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
  return Array.from({ length: 3 }).map((_, index) => (
    <div key={index} className="flex items-center justify-center">
      <Skeleton className="w-full h-48" />
    </div>
  ));
}
