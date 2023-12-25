import { protectedProcedure, router } from '@/server/trpc'
import { createInvitationInput } from './input'
import { createInvitation } from './service'

export const dashboardUserRouter = router({
  createInvigation: protectedProcedure
    .input(createInvitationInput)
    .mutation(({ input, ctx }) => createInvitation(input, ctx.session)),
})
