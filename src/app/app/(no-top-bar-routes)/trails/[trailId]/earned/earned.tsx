"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTrail } from "@/hooks/trails/use-get-trail";
import Image from "next/image";
import Link from "next/link";

interface Props {
  trailId: string;
}

export function Earned({ trailId }: Props) {
  const { data: trail, isPending } = useGetTrail({
    trailId,
  });

  if (isPending || !trail) return <Loading />;

  return (
    <div className="mt-16 text-center w-full flex flex-col items-center gap-8 justify-center">
      <div className="space-y-2">
        <h1 className="text-2xl">
          Parabéns, você completou a trilha e conquistou o badge{" "}
          <span className="font-bold">{`${trail?.badge?.title} ${trail?.badge?.level}`}</span>
        </h1>
        <p className="text-muted-foreground">{trail?.badge?.description}</p>
      </div>

      <Image
        src={trail?.badge?.url ?? ""}
        alt={trail?.badge?.title ?? ""}
        width={1024}
        height={1024}
        className="max-w-96 h-auto w-full rounded-lg"
      />

      <div className="flex justify-center items-center gap-2">
        <Button variant="outline" asChild>
          <Link href={`/app/trails/${trailId}`}>Voltar para a trilha</Link>
        </Button>
        <Button disabled>Gerar mais Quests e aumentar o nível do badge</Button>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="mt-16 text-center w-full flex flex-col items-center gap-8 justify-center">
      <div className="w-full flex flex-col gap-2 items-center justify-center">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-1/2 h-4" />
      </div>

      <Skeleton className="max-w-96 h-96 w-full rounded-lg" />

      <div className="flex justify-center items-center gap-2">
        <Skeleton className="w-36 h-9" />
        <Skeleton className="w-36 h-9" />
      </div>
    </div>
  );
}
