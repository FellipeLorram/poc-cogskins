"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";
import {
  UpdateTrailRequest,
  UpdateTrailResponse,
} from "@/entities/trail-actions";

export async function updateTrail({
  trailId,
  data,
}: UpdateTrailRequest): Promise<UpdateTrailResponse> {
  await getSessionUser();

  const updatedTrail = await prisma.trail.update({
    where: { id: trailId },
    data,
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

  return { trail: updatedTrail };
}
