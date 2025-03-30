"use server";

import { prisma } from "@/lib/prisma-client";
import { getSession } from "../auth/get-session";

export async function getSessionUser() {
  const session = await getSession();

  const user = await prisma.user.findUnique({
    where: {
      id: session?.userId ?? "",
    },
  });

  return user;
}
