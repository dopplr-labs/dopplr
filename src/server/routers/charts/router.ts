import z from 'zod'
import { protectedProcedure, router } from '@/server/trpc'
import { addOrRemoveFromDashboardInput, createChartInput, updateChartInput } from './input'
import {
  addToDashboard,
  createChart,
  deleteChart,
  duplicateChart,
  findChartById,
  getUserCharts,
  removeFromDashboard,
  updateChart,
} from './service'
import { isDashboardEditable } from '../dashboards/middlewares'

const idSchema = z.object({ id: z.number() })

export const chartsRouter = router({
  create: protectedProcedure.input(createChartInput).mutation(({ input, ctx }) => createChart(input, ctx.session)),
  getUserCharts: protectedProcedure.query(({ ctx }) => getUserCharts(ctx.session)),
  delete: protectedProcedure.input(idSchema).mutation(({ input, ctx }) => deleteChart(input.id, ctx.session)),
  duplicate: protectedProcedure.input(idSchema).mutation(({ input, ctx }) => duplicateChart(input.id, ctx.session)),
  findOneById: protectedProcedure.input(idSchema).query(({ input }) => findChartById(input.id)),
  update: protectedProcedure.input(updateChartInput).mutation(({ input, ctx }) => updateChart(input, ctx.session)),
  addToDashboard: protectedProcedure
    .input(addOrRemoveFromDashboardInput)
    .use(isDashboardEditable)
    .mutation(({ input }) => addToDashboard(input)),
  removeFromDashboard: protectedProcedure
    .input(addOrRemoveFromDashboardInput)
    .use(isDashboardEditable)
    .mutation(({ input }) => removeFromDashboard(input)),
})
