import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { t } from '@/server/trpc'
import { db } from '@/db'
import { dashboardUser } from '@/db/schema/dashboard-user'

export const isDashboardAccessible = t.middleware(async (opts) => {
  const { ctx, input } = opts

  const _input = input as { id: number }

  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const dashboards = await db
    .select()
    .from(dashboardUser)
    .where(and(eq(dashboardUser.user, ctx.session.user.id), eq(dashboardUser.dashboard, _input.id)))

  if (dashboards.length === 0) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return opts.next({ ctx: { session: ctx.session } })
})

export const isDashboardEditable = t.middleware(async (opts) => {
  const { ctx, input } = opts

  const _input = input as { id: number }

  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const dashboards = await db
    .select()
    .from(dashboardUser)
    .where(and(eq(dashboardUser.user, ctx.session.user.id), eq(dashboardUser.dashboard, _input.id)))

  if (dashboards.length === 0) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  if (!['EDITOR', 'OWNER'].includes(dashboards[0].role)) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to access this resource!' })
  }

  return opts.next({ ctx: { session: ctx.session } })
})

export const isDashboardOwner = t.middleware(async (opts) => {
  const { ctx, input } = opts

  const _input = input as { id: number }

  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const dashboards = await db
    .select()
    .from(dashboardUser)
    .where(and(eq(dashboardUser.user, ctx.session.user.id), eq(dashboardUser.dashboard, _input.id)))

  if (dashboards.length === 0) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  if (dashboards[0].role !== 'OWNER') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to access this resource!' })
  }

  return opts.next({ ctx: { session: ctx.session } })
})
