import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import * as prettier from 'prettier/standalone'
import SqlFormatter from 'prettier-plugin-sql'
import { formatQueryInput, runQueryInput } from './input'
import { getPgClientForConnectionString } from '@/lib/pg/client'

export async function runQuery(input: z.infer<typeof runQueryInput>) {
  if (input.type === 'postgres') {
    const client = getPgClientForConnectionString(input.connectionString)
    // TODO: Check if this query method is insecure or not
    // and how to prevent SQL injection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const result = await client.unsafe(input.query)
    return result
  }

  throw new TRPCError({
    code: 'NOT_IMPLEMENTED',
  })
}

export async function formatQuery(input: z.infer<typeof formatQueryInput>) {
  const FORMATTER_OPTIONS = {
    plugins: [SqlFormatter],
    formatter: 'sql-formatter',
    language: 'postgresql',
    database: 'postgresql',
    parser: 'sql',
  }

  const formattedQuery = prettier.format(input.query, {
    ...FORMATTER_OPTIONS,
    ...input.options,
  })

  return formattedQuery
}
