import React from "react";

interface Props {
  params: Promise<{
    trailId: string;
    questId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { trailId, questId } = await params;

  return (
    <div>
      {trailId} - {questId}
    </div>
  );
}
