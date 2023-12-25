import { z } from 'zod'

export const createInvitationInput = z.object({
  to: z.string(),
  dashboard: z.number(),
  role: z.enum(['EDITOR', 'VIEWER', 'OWNER']),
  status: z.enum(['CONFIRMED', 'NOT_CONFIRMED']).default('NOT_CONFIRMED').optional(),
})
