'use server'

import { cookies } from 'next/headers'
import { decrypt } from './session'

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  if (!session) return null

  const sessionPayload = await decrypt(session)

  return sessionPayload
}
