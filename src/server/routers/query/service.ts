import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { runQueryInput } from './input'
import { getPgClientForConnectionString } from '@/lib/pg/client'

export async function runQuery(input: z.infer<typeof runQueryInput>) {
  if (input.type === 'postgres') {
    const client = getPgClientForConnectionString(input.connectionString)
    // TODO: Check if this query method is insecure or not
    // and how to prevent SQL injection
    const result = await client.unsafe(input.query)
    return result
  }

  throw new TRPCError({
    code: 'NOT_IMPLEMENTED',
  })
}
