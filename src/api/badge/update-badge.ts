"use server";

import { prisma } from "@/lib/prisma-client";

interface Props {
  badgeId: string;
  level: number;
}

export async function updateBadge({ badgeId, level }: Props) {
  await prisma.badge.update({
    where: { id: badgeId },
    data: { level },
  });
}
