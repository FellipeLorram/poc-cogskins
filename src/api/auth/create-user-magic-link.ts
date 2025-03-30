"server-only";

import { prisma } from "@/lib/prisma-client";
import { User } from "@prisma/client";

export async function createUserMagicLink({ email }: { email: string }) {
  let user: User | null;

  user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
      },
    });
  }

  return user;
}
