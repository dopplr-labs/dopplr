import z from 'zod'

export const createChartInput = z.object({
  query: z.string(),
  description: z.string().optional(),
  name: z.string().min(3, 'Enter at least 3 characters'),
  config: z.any(),
  type: z.enum([
    'BAR_CHART',
    'COLUMN_CHART',
    'PIE_CHART',
    'LINE_CHART',
    'AREA_CHART',
    'GAUGE_CHART',
    'SCATTER_CHART',
    'HEAT_MAP',
    'STAT_CARD',
  ]),
  resource: z.number().positive(),
})

export const updateChartInput = createChartInput
  .omit({
    resource: true,
  })
  .partial()
  .extend({
    id: z.number(),
  })

export const addOrRemoveFromDashboardInput = z.object({
  chartId: z.number(),
  id: z.coerce.number(),
})
