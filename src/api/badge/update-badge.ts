"use server";

import { prisma } from "@/lib/prisma-client";

interface Props {
  badgeId: string;
  level: number;
}

export const badgeLevelMap: Record<number, string> = {
  0: "/badges/wsr_level0.png",
  1: "/badges/wsr_level1.png",
  2: "/badges/wsr_level2.png",
  3: "/badges/wsr_level3.png",
  4: "/badges/wsr_level4.png",
  5: "/badges/wsr_level5.png",
  6: "/badges/wsr_level6.png",
  7: "/badges/wsr_level7.png",
  8: "/badges/wsr_level8.png",
  9: "/badges/wsr_level9.png",
};

export async function updateBadge({ badgeId, level }: Props) {
  await prisma.badge.update({
    where: { id: badgeId },
    data: { level, url: badgeLevelMap[level] },
  });
}
