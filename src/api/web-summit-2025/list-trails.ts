"use server";

import { GeneratedTrail } from "@/entities/trails";
import { prisma } from "@/lib/prisma-client";

interface ListWebSummit2025TrailsResponse {
  trails: GeneratedTrail[];
}

export async function listWebSummit2025Trails(): Promise<ListWebSummit2025TrailsResponse> {
  const trails = await prisma.trail.findMany({
    where: {
      flag: "web-summit-2025",
    },
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

  if (!trails) {
    throw new Error("No trails found");
  }

  return { trails };
}
