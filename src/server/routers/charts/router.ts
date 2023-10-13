import { protectedProcedure, router } from '@/server/trpc'
import { createChartInput } from './input'
import { createChart } from './service'

export const chartsRouter = router({
  create: protectedProcedure.input(createChartInput).mutation(({ input, ctx }) => createChart(input, ctx.session)),
})
