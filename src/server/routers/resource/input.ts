import { z } from 'zod'
import { PG_URL_REGEX } from '@/lib/pg/utils'
import { MYSQL_URL_REGEX } from '@/lib/mysql/utils'

export const testConnectionInput = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('postgres'),
    url: z.string().regex(PG_URL_REGEX),
  }),
  z.object({
    type: z.literal('mysql'),
    url: z.string().regex(MYSQL_URL_REGEX),
  }),
])

export const createResourceInput = testConnectionInput.and(
  z.object({
    name: z.string().nonempty(),
  }),
)

export const updateResourceInput = createResourceInput.optional().and(
  z.object({
    id: z.number().positive(),
  }),
)

export const getResourceInput = z.object({
  id: z.number().positive(),
})

export const deleteResourceInput = z.object({
  id: z.number().positive(),
})
