import { protectedProcedure, router } from '@/server/trpc'
import { createHistoryInput } from './input'
import { createHistory, getHistoryForUser } from './service'

export const historyRouter = router({
  create: protectedProcedure.input(createHistoryInput).mutation(({ input, ctx }) => createHistory(input, ctx.session)),
  getHistoryForUser: protectedProcedure.query(({ ctx }) => getHistoryForUser(ctx.session)),
})
