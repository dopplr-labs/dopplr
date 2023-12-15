import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { type Session } from 'next-auth'
import { and, eq } from 'drizzle-orm'
import { createResourceInput, deleteResourceInput, getResourceInput, updateResourceInput } from './input'
import { db } from '@/db'
import { resources } from '@/db/schema/resource'

export async function createResource(input: z.infer<typeof createResourceInput>, session: Session) {
  const [resource] = await db
    .insert(resources)
    .values({ name: input.name, type: input.type, connectionConfig: { url: input.url }, createdBy: session.user.id })
    .returning()
  return resource
}

export async function getResources(session: Session) {
  return db.select().from(resources).where(eq(resources.createdBy, session.user.id))
}

export async function getResource(input: z.infer<typeof getResourceInput>, session: Session) {
  const result = await db
    .select()
    .from(resources)
    .where(and(eq(resources.id, input.id), eq(resources.createdBy, session.user.id)))
  if (result.length === 0) {
    throw new TRPCError({
      code: 'NOT_FOUND',
    })
  }
  return result[0]
}

export async function updateResource(input: z.infer<typeof updateResourceInput>, session: Session) {
  if (input.type === 'postgres') {
    const result = await db
      .update(resources)
      .set({
        connectionConfig: typeof input.url === 'string' ? { url: input.url } : undefined,
        name: input.name,
      })
      .where(and(eq(resources.id, input.id), eq(resources.createdBy, session.user.id)))
      .returning()
    if (result.length === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      })
    }
    return result[0]
  }
  throw new TRPCError({
    code: 'NOT_IMPLEMENTED',
  })
}

export async function deleteResource(input: z.infer<typeof deleteResourceInput>, session: Session) {
  const result = await db
    .delete(resources)
    .where(and(eq(resources.id, input.id), eq(resources.createdBy, session.user.id)))
    .returning()
  if (result.length === 0) {
    throw new TRPCError({
      code: 'NOT_FOUND',
    })
  }
  return result
}
