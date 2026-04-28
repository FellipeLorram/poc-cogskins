"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getSessionUser } from "../user/get-session-user";

export async function verifySession() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) {
    throw new Error("Unauthorized");
  }

  // Get the user from database to ensure they exist
  const user = await getSessionUser();

  if (!user) {
    throw new Error("User not found in database");
  }

  return { userId: user.id, user };
}
