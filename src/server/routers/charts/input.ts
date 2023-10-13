import z from 'zod'

export const createChartInput = z.object({
  query: z.string(),
  name: z.string(),
  config: z.any(),
  resource: z.number().positive(),
})
