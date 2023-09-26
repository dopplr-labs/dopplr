import { z } from 'zod'

export const runQueryInput = z.object({
  type: z.enum(['postgres', 'mysql']),
  connectionString: z.string(),
  query: z.string(),
})

export const formatQueryInput = z.object({
  type: z.enum(['postgres', 'mysql']),
  query: z.string(),
  options: z.any().optional(),
})
