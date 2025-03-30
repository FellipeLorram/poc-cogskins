import { getSession } from "./get-session";

export async function verifySession() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
