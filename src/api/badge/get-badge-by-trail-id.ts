"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";

export async function getBadgeByTrailId(trailId: string) {
  const user = await getSessionUser();

  if (!user) return null;

  const badge = await prisma.badge.findUnique({
    where: { trailId, userId: user.id },
  });

  return badge;
}
