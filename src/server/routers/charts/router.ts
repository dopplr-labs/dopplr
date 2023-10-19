import { protectedProcedure, router } from '@/server/trpc'
import { createChartInput } from './input'
import { createChart, getUserCharts } from './service'

export const chartsRouter = router({
  create: protectedProcedure.input(createChartInput).mutation(({ input, ctx }) => createChart(input, ctx.session)),
  getUserCharts: protectedProcedure.query(({ ctx }) => getUserCharts(ctx.session)),
})
