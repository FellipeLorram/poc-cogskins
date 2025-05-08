"use server";

import { prisma } from "@/lib/prisma-client";

export async function createWebsummit2025Badge(userId: string) {
  const fakeTrail = await prisma.trail.create({
    data: {
      userId,
      title: "Drapper University Badge",
      estimatedDuration: 10,
      flag: "drapper-university",
    },
  });

  return await prisma.badge.create({
    data: {
      userId,
      trailId: fakeTrail.id,
      level: 1,
      url: "/badges/drapper-level-1.png",
      title: "Drapper University Badge",
      description: "Drapper University Badge",
      status: "UNLOCKED",
      flag: "drapper-university",
    },
  });
}
