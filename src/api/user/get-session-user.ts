"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { syncKindeUser } from "./sync-kinde-user";

export async function getSessionUser() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) return null;

  // Sync user from Kinde to database (creates if doesn't exist, updates if exists)
  const user = await syncKindeUser();

  return user;
}
