import { z } from 'zod'
import { Session } from 'next-auth'
import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
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

export async function getHistoryForUser(session: Session) {
  return db
    .select()
    .from(history)
    .where(and(eq(history.createdBy, session.user.id), isNull(history.name)))
    .orderBy(desc(history.createdAt))
}

export async function getSavedQueriesForUser(session: Session) {
  return db
    .select()
    .from(history)
    .where(and(eq(history.createdBy, session.user.id), isNotNull(history.name)))
    .orderBy(desc(history.createdAt))
}

export async function removeHistoryItem(id: number, session: Session) {
  const existingHistory = await db.select().from(history).where(eq(history.id, id))
  if (!existingHistory[0]) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Could not remove item, please try again later!' })
  }

  if (existingHistory[0].createdBy !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to remove this item!' })
  }

  return db.delete(history).where(eq(history.id, id)).returning()
}

export async function clearAllHistoryForUser(session: Session) {
  return db.delete(history).where(eq(history.createdBy, session.user.id)).returning()
}
