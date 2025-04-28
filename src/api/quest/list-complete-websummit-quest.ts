"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";

export async function listCompleteWebSummitQuest() {
  const user = await getSessionUser();

  if (!user) return;

  return await prisma.completedQuest.findMany({
    where: {
      userId: user.id,
    },
  });
}
