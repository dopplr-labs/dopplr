import z from 'zod'
import { protectedProcedure, router } from '@/server/trpc'
import {
  createDashboard,
  deleteDashboard,
  duplicateDashboard,
  findDashboardById,
  findDashboardWithCharts,
  findUserDashboards,
  updateDashboard,
} from './service'
import { createDashboardInput, updateDashboardInput } from './input'
import { isDashboardAccessible, isDashboardEditable, isDashboardOwner } from './middlewares'

const idSchema = z.object({
  id: z.number().positive(),
})

export const dashboardsRouter = router({
  findUserDashboard: protectedProcedure.query(({ ctx }) => findUserDashboards(ctx.session)),
  create: protectedProcedure
    .input(createDashboardInput)
    .mutation(({ input, ctx }) => createDashboard(input, ctx.session)),
  delete: protectedProcedure
    .input(idSchema)
    .use(isDashboardOwner)
    .mutation(({ input }) => deleteDashboard(input.id)),
  duplicate: protectedProcedure.input(idSchema).mutation(({ input, ctx }) => duplicateDashboard(input.id, ctx.session)),
  findOneById: protectedProcedure
    .input(idSchema)
    .use(isDashboardAccessible)
    .query(({ input }) => findDashboardById(input.id)),
  findOneWithCharts: protectedProcedure
    .input(idSchema)
    .use(isDashboardAccessible)
    .query(({ input }) => findDashboardWithCharts(input.id)),
  update: protectedProcedure
    .input(updateDashboardInput)
    .use(isDashboardEditable)
    .mutation(({ input }) => updateDashboard(input)),
})
