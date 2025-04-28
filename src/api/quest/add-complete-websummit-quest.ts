"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";

export async function addCompleteWebSummitQuest(questId: string) {
  const user = await getSessionUser();

  if (!user) return;

  return await prisma.completedQuest.create({
    data: {
      userId: user.id,
      id: questId,
    },
  });
}
