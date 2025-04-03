"use client";

import { useGetTrail } from "@/hooks/trails/use-get-trail";

interface Props {
  trailId: string;
}

export function Trail({ trailId }: Props) {
  const { data: trail, isPending } = useGetTrail({
    trailId,
  });

  if (isPending) return <div>Loading...</div>;

  return (
    <div>
      <h1>{trail?.title}</h1>
    </div>
  );
}
