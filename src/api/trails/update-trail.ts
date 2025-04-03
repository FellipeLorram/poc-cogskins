"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";
import { TrailStatus, Trail } from "@prisma/client";

interface UpdateTrailRequest {
  trailId: string;
  trailStatus: TrailStatus;
}

interface UpdateTrailResponse {
  trail: Trail | null;
}

export async function updateTrail({
  trailId,
  trailStatus,
}: UpdateTrailRequest): Promise<UpdateTrailResponse> {
  const user = await getSessionUser();

  if (!user) return { trail: null };

  const trail = await prisma.trail.update({
    where: { id: trailId },
    data: {
      status: trailStatus,
    },
  });

  return { trail };
}
