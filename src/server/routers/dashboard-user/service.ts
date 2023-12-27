import { z } from 'zod'
import { Session } from 'next-auth'
import dayjs from 'dayjs'
import { and, eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { createInvitationInput, findSentInvitationsInput } from './input'
import { db } from '@/db'
import { dashboardUserInvite } from '@/db/schema/dashboard-user'
import { users } from '@/db/schema/auth'
import { dashboards } from '@/db/schema/dashboards'

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

export async function findSentInvitations(input: z.input<typeof findSentInvitationsInput>, session: Session) {
  const result = await db
    .select()
    .from(dashboardUserInvite)
    .where(and(eq(dashboardUserInvite.from, session.user.id), eq(dashboardUserInvite.dashboard, input.dashboard)))
    .leftJoin(users, eq(dashboardUserInvite.to, users.id))

  return result.map((item) => ({
    ...item.dashboard_user_invite,
    to: item.user,
  }))
}

export async function findReceivedInvitations(session: Session) {
  const result = await db
    .select()
    .from(dashboardUserInvite)
    .leftJoin(users, eq(dashboardUserInvite.from, users.id))
    .leftJoin(dashboards, eq(dashboardUserInvite.dashboard, dashboards.id))
    .where(and(eq(dashboardUserInvite.to, session.user.id), eq(dashboardUserInvite.status, 'NOT_CONFIRMED')))

  return result.map((item) => ({
    ...item.dashboard_user_invite,
    from: item.user!,
    dashboard: item.dashboards!,
  }))
}
