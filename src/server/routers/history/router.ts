import { protectedProcedure, router } from '@/server/trpc'
import { createHistoryInput } from './input'
import { createHistory } from './service'

export const historyRouter = router({
  create: protectedProcedure.input(createHistoryInput).mutation(({ input, ctx }) => createHistory(input, ctx.session)),
})
