import z from 'zod'
import { protectedProcedure, router } from '@/server/trpc'
import { createChartInput } from './input'
import { createChart, deleteChart, getUserCharts } from './service'

export const chartsRouter = router({
  create: protectedProcedure.input(createChartInput).mutation(({ input, ctx }) => createChart(input, ctx.session)),
  getUserCharts: protectedProcedure.query(({ ctx }) => getUserCharts(ctx.session)),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) => deleteChart(input.id, ctx.session)),
})
