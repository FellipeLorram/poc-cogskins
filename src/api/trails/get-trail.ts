"use server";

import { GeneratedTrail } from "@/entities/trails";
import { prisma } from "@/lib/prisma-client";

interface GetTrailRequest {
  trailId: string;
  flag?: string;
}

interface GetTrailResponse {
  trail: GeneratedTrail | null;
}

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
      badge: true,
    },
  });

  return { trail };
}
