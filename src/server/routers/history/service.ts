import { z } from 'zod'
import { Session } from 'next-auth'
import { createHistoryInput } from './input'
import { db } from '@/db'
import { history } from '@/db/schema/history'

export async function createHistory(input: z.infer<typeof createHistoryInput>, session: Session) {
  const historyCreated = await db
    .insert(history)
    .values({
      query: input.query,
      name: input.name,
      resourceId: input.resource,
      createdBy: session.user.id,
    })
    .returning()

  return historyCreated[0]
}
