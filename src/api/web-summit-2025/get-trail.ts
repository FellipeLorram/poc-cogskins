"use server";

import { prisma } from "@/lib/prisma-client";

export async function getTrail(trailId: string) {
  return await prisma.webSummitTrail.findUnique({ where: { id: trailId } });
}
