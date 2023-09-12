import { z } from 'zod'

export const runQueryInput = z.object({
  type: z.enum(['postgres', 'mysql']),
  connectionString: z.string(),
  query: z.string(),
})
