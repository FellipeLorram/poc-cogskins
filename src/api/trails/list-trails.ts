"use server";

import { prisma } from "@/lib/prisma-client";
import { verifySession } from "../auth/verify-session";

export async function listTrails() {
  const { userId } = await verifySession();

  const trails = await prisma.trail.findMany({
    where: {
      userId,
    },
  });

  return trails;
}
