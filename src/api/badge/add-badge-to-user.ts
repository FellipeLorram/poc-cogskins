"use server";

import { prisma } from "@/lib/prisma-client";

interface Props {
  userId: string;
  badgeId: string;
}

export async function addBadgeToUser({ userId, badgeId }: Props) {
  const badge = await prisma.badge.findUnique({
    where: { id: badgeId },
  });

  if (!badge) {
    throw new Error("Badge not found");
  }

  await prisma.badge.update({
    where: { id: badgeId },
    data: { userId, earnedAt: new Date(), level: 1 },
  });
}
