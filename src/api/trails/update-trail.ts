"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";
import {
  UpdateTrailRequest,
  UpdateTrailResponse,
} from "@/entities/trail-actions";

export async function updateTrail({
  trail,
}: UpdateTrailRequest): Promise<UpdateTrailResponse> {
  const user = await getSessionUser();

  if (!user) return { trail: null };

  const updatedTrail = await prisma.trail.update({
    where: { id: trail.id },
    data: {
      status: trail.status,
    },
  });

  return { trail: updatedTrail };
}
