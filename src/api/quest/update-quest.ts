"use server";

import { prisma } from "@/lib/prisma-client";
import { QuestStatus } from "@prisma/client";

interface Props {
  questId: string;
  status: QuestStatus;
  attempts?: number;
}

export async function updateQuest({ questId, status, attempts }: Props) {
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
