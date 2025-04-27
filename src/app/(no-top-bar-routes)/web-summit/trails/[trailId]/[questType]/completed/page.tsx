import { TopBar } from "../../../../top-bar";
import React from "react";
import { Result } from "./result";
import { TrailId } from "@/app/(no-top-bar-routes)/web-summit/types";

interface Props {
  params: Promise<{
    trailId: TrailId;
    questType: string;
  }>;
}

export default async function page({ params }: Props) {
  const { trailId, questType } = await params;

  return (
    <div className="w-full flex flex-col gap-8 h-screen">
      <TopBar title="Quests Results" />
      <Result trailId={trailId} questType={questType} />
    </div>
  );
}
