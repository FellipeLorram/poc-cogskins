"use server";

import { prisma } from "@/lib/prisma-client";

interface Props {
  badgeId: string;
  level: number;
}

const badgeLevelMap: Record<number, string> = {
  0: "/badges/drapper-level-0.png",
  1: "/badges/drapper-level-1.png",
  2: "/badges/drapper-level-2.png",
  3: "/badges/drapper-level-3.png",
};

export async function updateBadge({ badgeId, level }: Props) {
  await prisma.badge.update({
    where: { id: badgeId },
    data: { level, url: badgeLevelMap[level] },
  });
}
