import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import postgres from 'postgres'
import { type Session } from 'next-auth'
import { eq } from 'drizzle-orm'
import { createResourceSchema, getResourceSchema, testConnectionSchema } from './resource.schema'
import { db } from '@/db'
import { resources } from '@/db/schema/resource'

export async function testConnection(input: z.infer<typeof testConnectionSchema>) {
  if (input.type === 'postgres') {
    const client = postgres(input.url)
    try {
      const result = await client`SELECT 1 AS testValue;`
      return result[0].testvalue === 1
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Could not connect to database',
      })
    }
  } else {
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
    })
  }
}

export async function createResource(input: z.infer<typeof createResourceSchema>, session: Session) {
  if (input.type === 'postgres') {
    return db
      .insert(resources)
      .values({ name: input.name, type: 'postgres', connectionConfig: { url: input.url }, createdBy: session.user.id })
      .returning()
  } else {
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
    })
  }
}

export async function getResources(session: Session) {
  return db.select().from(resources).where(eq(resources.createdBy, session.user.id))
}

export async function getResource(input: z.infer<typeof getResourceSchema>, session: Session) {
  const result = await db
    .select()
    .from(resources)
    .where(eq(resources.id, input.id))
    .where(eq(resources.createdBy, session.user.id))
  if (result.length === 0) {
    throw new TRPCError({
      code: 'NOT_FOUND',
    })
  }
  return result[0]
}
