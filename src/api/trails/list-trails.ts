"use server";

import { prisma } from "@/lib/prisma-client";
import { Prisma } from "@prisma/client";
import { getSessionUser } from "../user/get-session-user";

export type TrailWithRelations = Prisma.TrailGetPayload<{
  include: {
    inputContents: true;
    quests: {
      include: {
        questions: true;
      };
    };
    badge: true;
  };
}>;

export async function listTrails(): Promise<TrailWithRelations[]> {
  const user = await getSessionUser();

  if (!user) return [];

  const trails = await prisma.trail.findMany({
    where: {
      userId: user.id,
      AND: [
        {
          NOT: {
            flag: "web-summit-2025",
          },
        },
      ],
    },
    include: {
      badge: true,
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

  return trails;
}
