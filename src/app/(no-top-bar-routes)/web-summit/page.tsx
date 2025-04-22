import { listWebSummit2025Trails } from "@/api/web-summit-2025/list-trails";
import { TrailList } from "./trail-list";
import { AlphaTesterDialog } from "./alpha-tester-dialog";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  const trailsListPromise = listWebSummit2025Trails();

  return (
    <>
      <AlphaTesterDialog />
      <Suspense fallback={<Loading />}>
        <TrailList trailListPromise={trailsListPromise} />
      </Suspense>
    </>
  );
}

function Loading() {
  return Array.from({ length: 3 }).map((_, index) => (
    <div key={index} className="flex items-center justify-center">
      <Skeleton className="w-full h-48" />
    </div>
  ));
}
