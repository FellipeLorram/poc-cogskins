"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";

export async function listUserBadges() {
  const user = await getSessionUser();

  if (!user) return [];

  const badges = await prisma.badge.findMany({
    where: {
      userId: user.id,
    },
  });

  return badges;
}
