import { z } from 'zod'
import { Session } from 'next-auth'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { createInvitationInput } from './input'
import { db } from '@/db'
import { dashboardUserInvite } from '@/db/schema/dashboard-user'
import { users } from '@/db/schema/auth'

export async function createInvitation(input: z.infer<typeof createInvitationInput>, session: Session) {
  const expireOn = dayjs().add(10, 'days').toDate()

  const user = await db.select().from(users).where(eq(users.email, input.to))
  if (user.length === 0) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found!',
    })
  }

  const invitation = await db
    .insert(dashboardUserInvite)
    .values({
      from: session.user.id,
      to: user[0].id,
      dashboard: input.dashboard,
      role: input.role,
      expireOn,
    })
    .returning()

  return invitation[0]
}
