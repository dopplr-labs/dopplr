import z from 'zod'
import { protectedProcedure, router } from '@/server/trpc'
import { createChartInput } from './input'
import { createChart, deleteChart, duplicateChart, getUserCharts } from './service'

const idSchema = z.object({ id: z.number() })

export const chartsRouter = router({
  create: protectedProcedure.input(createChartInput).mutation(({ input, ctx }) => createChart(input, ctx.session)),
  getUserCharts: protectedProcedure.query(({ ctx }) => getUserCharts(ctx.session)),
  delete: protectedProcedure.input(idSchema).mutation(({ input, ctx }) => deleteChart(input.id, ctx.session)),
  duplicate: protectedProcedure.input(idSchema).mutation(({ input, ctx }) => duplicateChart(input.id, ctx.session)),
})
