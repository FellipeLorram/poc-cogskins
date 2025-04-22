"use server";

import { prisma } from "@/lib/prisma-client";

interface Props {
  trailId: string;
  questId: string;
}

export async function getQuest({ trailId, questId }: Props) {
  const quest = await prisma.quest.findUnique({
    where: { id: questId, trailId },
    include: {
      questions: true,
    },
  });

  return { quest };
}
