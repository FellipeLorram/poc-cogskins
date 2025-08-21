"use server";

import { prisma } from "@/lib/prisma-client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function syncKindeUser() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) return null;

  // Check if user already exists in database by email (since we use cuid() for id)
  let user = await prisma.user.findUnique({
    where: {
      email: kindeUser.email || "",
    },
  });

  // If user doesn't exist, create them
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: kindeUser.email || "",
        name:
          `${kindeUser.given_name || ""} ${kindeUser.family_name || ""}`.trim() ||
          kindeUser.email ||
          "",
        image: kindeUser.picture || null,
      },
    });
  } else {
    // Update existing user with latest info from Kinde
    user = await prisma.user.update({
      where: {
        email: kindeUser.email || "",
      },
      data: {
        name:
          `${kindeUser.given_name || ""} ${kindeUser.family_name || ""}`.trim() ||
          user.name,
        image: kindeUser.picture || user.image,
      },
    });
  }

  return user;
}
