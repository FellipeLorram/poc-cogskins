"use server";

import { prisma } from "@/lib/prisma-client";
import { verifySession } from "../auth/verify-session";
import { Prisma } from "@prisma/client";

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
  try {
    const { userId } = await verifySession();

    const trails = await prisma.trail.findMany({
      where: {
        userId,
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
  } catch (error) {
    console.error("Error listing trails:", error);
    throw new Error("Falha ao buscar trilhas do banco de dados");
  }
}
