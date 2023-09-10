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

export const updateResourceSchema = createResourceSchema.optional().and(
  z.object({
    id: z.number().positive(),
  }),
)

export const getResourceSchema = z.object({
  id: z.number().positive(),
})

export const deleteResourceSchema = z.object({
  id: z.number().positive(),
})
