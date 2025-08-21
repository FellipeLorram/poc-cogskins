"use server";

import { GetTrailRequest, GetTrailResponse } from "@/entities/trail-actions";
import { prisma } from "@/lib/prisma-client";

export async function getTrail({
  trailId,
}: GetTrailRequest): Promise<GetTrailResponse> {
  const trail = await prisma.trail.findUnique({
    where: { id: trailId },
    include: {
      inputContents: true,
      quests: {
        include: {
          questions: true,
        },
      },
      badge: {
        include: {
          badgeUrls: true,
        },
      },
    },
  });

  return { trail };
}
