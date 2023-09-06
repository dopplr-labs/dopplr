import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import postgres from 'postgres'
import { testConnectionSchema } from './resource.schema'

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
