"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";
import { QuestStatus } from "@prisma/client";

interface Props {
  questId: string;
  status: QuestStatus;
  attempts?: number;
}

export async function updateQuest({ questId, status, attempts }: Props) {
  const user = await getSessionUser();

  if (!user) return { quest: null };

  const quest = await prisma.quest.update({
    where: { id: questId },
    data: {
      status,
      attempts,
      completedAt: status === QuestStatus.COMPLETED ? new Date() : null,
    },
  });

  return { quest };
}
