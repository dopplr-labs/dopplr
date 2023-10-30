import { protectedProcedure, router } from '@/server/trpc'
import { findUserDashboards } from './service'

export const dashboardsRouter = router({
  findUserDashboard: protectedProcedure.query(({ ctx }) => findUserDashboards(ctx.session)),
})
