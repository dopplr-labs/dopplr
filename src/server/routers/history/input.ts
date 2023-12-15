import { z } from 'zod'

export const createHistoryInput = z.object({
  query: z.string(),
  name: z.string().optional(),
  resource: z.number().positive(),
  type: z.enum(['SAVED_QUERY', 'HISTORY']).optional(),
})

export const removeHistoryItemInput = z.object({
  id: z.number().positive(),
})

export const updateHistoryInput = z.object({
  id: z.number().positive(),
  query: z.string().optional(),
  name: z.string().optional(),
  resource: z.number().positive().optional(),
})
