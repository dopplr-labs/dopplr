import { protectedProcedure, router } from '@/server/trpc'
import {
  acceptOrRejectInviteInput,
  createInvitationInput,
  deleteInvitationInput,
  findDashboardUserInput,
  findSentInvitationsInput,
} from './input'
import {
  acceptOrRejectInvite,
  createInvitation,
  deleteInvitation,
  findDashboardUser,
  findReceivedInvitations,
  findSentInvitations,
} from './service'

export const dashboardUserRouter = router({
  createInvitation: protectedProcedure
    .input(createInvitationInput)
    .mutation(({ input, ctx }) => createInvitation(input, ctx.session)),
  findSentInvitations: protectedProcedure
    .input(findSentInvitationsInput)
    .query(({ input, ctx }) => findSentInvitations(input, ctx.session)),
  findReceivedInvitations: protectedProcedure.query(({ ctx }) => findReceivedInvitations(ctx.session)),
  acceptOrRejectInvite: protectedProcedure
    .input(acceptOrRejectInviteInput)
    .mutation(({ input, ctx }) => acceptOrRejectInvite(input, ctx.session)),
  deleteInvitation: protectedProcedure
    .input(deleteInvitationInput)
    .mutation(({ input, ctx }) => deleteInvitation(input.id, ctx.session)),
  findDashboardUser: protectedProcedure
    .input(findDashboardUserInput)
    .query(({ input, ctx }) => findDashboardUser(input, ctx.session)),
})
