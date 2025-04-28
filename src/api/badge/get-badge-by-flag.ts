"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";

export async function getBadgeByFlag(flag: string) {
  const user = await getSessionUser();

  if (!user) return null;

  const badge = await prisma.badge.findFirst({
    where: { flag, userId: user.id },
  });

  return badge;
}
