"use server";

import { prisma } from "@/lib/prisma-client";
import { getSessionUser } from "../user/get-session-user";
import { ListTrailsResponse } from "@/entities/trail-actions";

export async function listTrails(): Promise<ListTrailsResponse> {
  const user = await getSessionUser();

  if (!user) return { trails: [] };

  const trails = await prisma.trail.findMany({
    where: {
      userId: user.id,
    },
    include: {
      badge: {
        include: {
          badgeUrls: true,
        },
      },
      inputContents: true,
      quests: {
        include: {
          questions: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { trails };
}
