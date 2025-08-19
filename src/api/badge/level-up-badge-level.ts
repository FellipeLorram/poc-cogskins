import { prisma } from "@/lib/prisma-client";

interface Props {
  badgeId: string;
  level: number;
  url: string;
}

export async function levelUpBadgeLevel({ badgeId, level, url }: Props) {
  await prisma.badge.update({
    where: { id: badgeId },
    data: { level, url, badgeUrls: { create: { url } } },
  });
}
