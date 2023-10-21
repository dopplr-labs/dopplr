import z from 'zod'

export const createChartInput = z.object({
  query: z.string(),
  name: z.string().min(3, 'Enter at least 3 characters'),
  config: z.any(),
  type: z.enum(['BAR_CHART', 'COLUMN_CHART', 'PIE_CHART', 'LINE_CHART']),
  resource: z.number().positive(),
})
