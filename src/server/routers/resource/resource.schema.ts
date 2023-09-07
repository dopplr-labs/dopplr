import { z } from 'zod'
import { PG_URL_REGEX } from '@/lib/pg/utils'
import { MYSQL_URL_REGEX } from '@/lib/mysql/utils'

export const testConnectionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('postgres'),
    url: z.string().regex(PG_URL_REGEX),
  }),
  z.object({
    type: z.literal('mysql'),
    url: z.string().regex(MYSQL_URL_REGEX),
  }),
])

export const createResourceSchema = testConnectionSchema.and(
  z.object({
    name: z.string().nonempty(),
  }),
)
