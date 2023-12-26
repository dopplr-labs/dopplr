import { protectedProcedure, router } from '@/server/trpc'
import { createInvitationInput } from './input'
import { createInvitation, findSentInvitations } from './service'

export const dashboardUserRouter = router({
  createInvitation: protectedProcedure
    .input(createInvitationInput)
    .mutation(({ input, ctx }) => createInvitation(input, ctx.session)),
  findSentInvitations: protectedProcedure.query(({ ctx }) => findSentInvitations(ctx.session)),
})
