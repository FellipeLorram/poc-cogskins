"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";
import { GeneratedTrail } from "@/entities/trails";

interface GetTrailRequest {
  trailId: string;
}

interface GetTrailResponse {
  trail: GeneratedTrail | null;
}

export async function getTrail({
  trailId,
}: GetTrailRequest): Promise<GetTrailResponse> {
  const user = await getSessionUser();

  if (!user) return { trail: null };

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
