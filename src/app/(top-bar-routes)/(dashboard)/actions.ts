"use server";

import { cookies } from "next/headers";

export async function clearRunCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("run-task-id");
  cookieStore.delete("run-task-access-token");
}
