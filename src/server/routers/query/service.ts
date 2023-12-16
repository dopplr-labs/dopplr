import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { format } from 'sql-formatter'
import { RowDataPacket } from 'mysql2/promise'
import { formatQueryInput, runQueryInput } from './input'
import { getPgClientForConnectionString } from '@/lib/pg/client'
import { getMySqlClientForConnectionString } from '@/lib/mysql/client'

export async function runQuery(input: z.infer<typeof runQueryInput>) {
  // TODO: Check if this query method is insecure or not
  // and how to prevent SQL injection

  if (input.type === 'postgres') {
    const client = getPgClientForConnectionString(input.connectionString)
    const result = await client.unsafe(input.query)

    return result
  } else if (input.type === 'mysql') {
    const client = await getMySqlClientForConnectionString(input.connectionString)
    const [result] = await client.query<RowDataPacket[]>(input.query)

    return result
  }

  throw new TRPCError({
    code: 'NOT_IMPLEMENTED',
  })
}

export async function formatQuery(input: z.infer<typeof formatQueryInput>) {
  const formattedQuery = format(input.query)

  return formattedQuery
}
