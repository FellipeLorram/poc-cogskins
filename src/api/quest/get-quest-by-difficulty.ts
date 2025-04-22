"use server";

import { prisma } from "@/lib/prisma-client";

interface Props {
  trailId: string;
  difficulty: number;
}

export async function getQuestByDifficulty({ trailId, difficulty }: Props) {
  const quest = await prisma.quest.findFirst({
    where: {
      trailId,
      difficultyLevel: difficulty,
    },
    include: {
      questions: true,
    },
  });

  return { quest };
}
