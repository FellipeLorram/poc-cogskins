"use server";

import { prisma } from "@/lib/prisma-client";

export async function createWebsummit2025Badge(userId: string) {
  return await prisma.badge.create({
    data: {
      userId,
      trailId: "cm9z6i9fz0000rxy2ygdnnss9",
      level: 1,
      url: "/badges/wsr_level1.png",
      title: "Web Summit 2025 Badge",
      description: "Web Summit 2025 Badge",
    },
  });
}
