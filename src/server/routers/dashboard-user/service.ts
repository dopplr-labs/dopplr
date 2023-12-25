import { z } from 'zod'
import { Session } from 'next-auth'
import dayjs from 'dayjs'
import { createInvitationInput } from './input'
import { db } from '@/db'
import { dashboardUserInvite } from '@/db/schema/dashboard-user'

export async function createInvitation(input: z.infer<typeof createInvitationInput>, session: Session) {
  const expriesOn = dayjs().add(10, 'days').toISOString()

  const invigation = await db
    .insert(dashboardUserInvite)
    .values({
      from: session.user.id,
      to: input.to,
      dashboard: input.dashboard,
      role: input.role,
      expriesOn,
    })
    .returning()

  return invigation[0]
}
