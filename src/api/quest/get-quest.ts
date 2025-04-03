"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";

interface Props {
  trailId: string;
  questId: string;
}

export async function getQuest({ trailId, questId }: Props) {
  const user = await getSessionUser();

  if (!user) return { quest: null };

  const quest = await prisma.quest.findUnique({
    where: { id: questId, trailId },
    include: {
      questions: true,
    },
  });

  return { quest };
}
