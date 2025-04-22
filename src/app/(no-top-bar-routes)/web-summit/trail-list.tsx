import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { GeneratedTrail } from "@/entities/trails";
import Link from "next/link";
import React, { use } from "react";

interface Props {
  trailListPromise: Promise<{ trails: GeneratedTrail[] }>;
}

export function TrailList({ trailListPromise }: Props) {
  const { trails } = use(trailListPromise);

  return (
    <div className="flex flex-col gap-4 w-full">
      {trails.map((trail) => (
        <TrailCard key={trail.id} trail={trail} />
      ))}
    </div>
  );
}

function TrailCard({ trail }: { trail: GeneratedTrail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{trail.title}</CardTitle>
        <CardDescription>{trail.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={`/trails/${trail.id}?flag=web-summit-2025`}>
          <Button>Start</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
