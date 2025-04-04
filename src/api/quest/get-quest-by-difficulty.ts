"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";

interface Props {
  trailId: string;
  difficulty: number;
}

export async function getQuestByDifficulty({ trailId, difficulty }: Props) {
  const user = await getSessionUser();

  if (!user) return { quest: null };

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
