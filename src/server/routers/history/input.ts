import { z } from 'zod'

export const createHistoryInput = z.object({
  query: z.string(),
  name: z.string().optional(),
  resource: z.number().positive(),
})
