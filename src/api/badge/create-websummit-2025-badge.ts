"use server";

import { prisma } from "@/lib/prisma-client";

export async function createWebsummit2025Badge(userId: string) {
  const fakeTrail = await prisma.trail.create({
    data: {
      userId,
      title: "Web Summit 2025 Badge",
      estimatedDuration: 10,
      flag: "web-summit-2025",
    },
  });

  return await prisma.badge.create({
    data: {
      userId,
      trailId: fakeTrail.id,
      level: 1,
      url: "/badges/wsr_level1.png",
      title: "Web Summit 2025 Badge",
      description: "Web Summit 2025 Badge",
      status: "UNLOCKED",
    },
  });
}
