import { protectedProcedure, router } from '@/server/trpc'
import { createHistoryInput, removeHistoryItemInput, updateHistoryInput } from './input'
import {
  clearAllHistoryForUser,
  createHistory,
  getHistoryForUser,
  getSavedQueriesForUser,
  removeHistoryItem,
  updateHistory,
} from './service'

export const historyRouter = router({
  create: protectedProcedure.input(createHistoryInput).mutation(({ input, ctx }) => createHistory(input, ctx.session)),
  updateHistory: protectedProcedure
    .input(updateHistoryInput)
    .mutation(({ input, ctx }) => updateHistory(input, ctx.session)),
  getHistoryForUser: protectedProcedure.query(({ ctx }) => getHistoryForUser(ctx.session)),
  getSavedQueriesForUser: protectedProcedure.query(({ ctx }) => getSavedQueriesForUser(ctx.session)),
  removeHistoryItem: protectedProcedure
    .input(removeHistoryItemInput)
    .mutation(({ input, ctx }) => removeHistoryItem(input.id, ctx.session)),
  clearHistoryForUser: protectedProcedure.mutation(({ ctx }) => clearAllHistoryForUser(ctx.session)),
})
