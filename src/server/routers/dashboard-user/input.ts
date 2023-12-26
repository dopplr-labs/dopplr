import { z } from 'zod'

export const createInvitationInput = z.object({
  to: z.string().email(),
  dashboard: z.number(),
  role: z.enum(['EDITOR', 'VIEWER', 'OWNER']),
  status: z.enum(['CONFIRMED', 'NOT_CONFIRMED']).default('NOT_CONFIRMED').optional(),
})

export const findSentInvitationsInput = z.object({
  dashboard: z.number(),
})
