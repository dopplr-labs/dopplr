import { protectedProcedure, router } from '@/server/trpc'
import { createInvitationInput, findSentInvitationsInput } from './input'
import { createInvitation, findSentInvitations } from './service'

export const dashboardUserRouter = router({
  createInvitation: protectedProcedure
    .input(createInvitationInput)
    .mutation(({ input, ctx }) => createInvitation(input, ctx.session)),
  findSentInvitations: protectedProcedure
    .input(findSentInvitationsInput)
    .query(({ input, ctx }) => findSentInvitations(input, ctx.session)),
})
