import { protectedProcedure, router } from '@/server/trpc'
import { createDashboard, findUserDashboards } from './service'
import { createDashboardInput } from './input'

export const dashboardsRouter = router({
  findUserDashboard: protectedProcedure.query(({ ctx }) => findUserDashboards(ctx.session)),
  create: protectedProcedure
    .input(createDashboardInput)
    .mutation(({ input, ctx }) => createDashboard(input, ctx.session)),
})
