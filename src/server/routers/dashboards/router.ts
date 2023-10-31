import z from 'zod'
import { protectedProcedure, router } from '@/server/trpc'
import {
  createDashboard,
  deleteDashboard,
  duplicateDashboard,
  findDashboardById,
  findDashboardWithCharts,
  findUserDashboards,
} from './service'
import { createDashboardInput } from './input'

const idSchema = z.object({
  id: z.number().positive(),
})

export const dashboardsRouter = router({
  findUserDashboard: protectedProcedure.query(({ ctx }) => findUserDashboards(ctx.session)),
  create: protectedProcedure
    .input(createDashboardInput)
    .mutation(({ input, ctx }) => createDashboard(input, ctx.session)),
  delete: protectedProcedure.input(idSchema).mutation(({ input, ctx }) => deleteDashboard(input.id, ctx.session)),
  duplicate: protectedProcedure.input(idSchema).mutation(({ input, ctx }) => duplicateDashboard(input.id, ctx.session)),
  findOneById: protectedProcedure.input(idSchema).query(({ input }) => findDashboardById(input.id)),
  findOneWithCharts: protectedProcedure.input(idSchema).query(({ input }) => findDashboardWithCharts(input.id)),
})
