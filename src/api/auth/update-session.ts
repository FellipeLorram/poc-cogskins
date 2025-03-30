'use server'

import { createSession } from './session'

export async function updateSession({
  userId,
  orgId,
}: { userId: string; orgId: string }) {
  await createSession({ userId, orgId })
}
