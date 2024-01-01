import { eq } from 'drizzle-orm'
import { Session } from 'next-auth'
import z from 'zod'
import { TRPCError } from '@trpc/server'
import { db } from '@/db'
import { dashboards } from '@/db/schema/dashboards'
import { createDashboardInput, updateDashboardInput } from './input'
import { charts, chartsToDashboards } from '@/db/schema/charts'
import { dashboardUser } from '@/db/schema/dashboard-user'

/**
 * There can be two type of dashboards that a user can have
 * 1. Dashboard which a user created by himself
 * 2. Dashboard on which the user is invited
 * */
export async function findUserDashboards(session: Session) {
  /**
   * We create a DashboardUser with OWNER role when user crates a dashboard,
   * it makes the process to find the dashboards easier
   * */
  const dashboardUsers = await db
    .select()
    .from(dashboardUser)
    .where(eq(dashboardUser.user, session.user.id))
    .leftJoin(dashboards, eq(dashboards.id, dashboardUser.dashboard))

  return dashboardUsers.map((i) => ({ ...i.dashboards, role: i.dashboard_user.role }))
}

export async function createDashboard(input: z.infer<typeof createDashboardInput>, session: Session) {
  const dashboardCreated = await db
    .insert(dashboards)
    .values({
      ...input,
      createdBy: session.user.id,
    })
    .returning()

  /** To keep track of permissions on dashboard */
  await db.insert(dashboardUser).values({
    dashboard: dashboardCreated[0].id,
    role: 'OWNER',
    user: session.user.id,
  })

  return dashboardCreated[0]
}

export async function findDashboardById(id: number) {
  const dashboardFound = await db.select().from(dashboards).where(eq(dashboards.id, id))

  if (!dashboardFound) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Dashboard not found',
    })
  }

  return dashboardFound[0]
}

export async function deleteDashboard(id: number) {
  const deletedDashboard = await db.delete(dashboards).where(eq(dashboards.id, id)).returning()
  return deletedDashboard[0]
}

export async function duplicateDashboard(id: number, session: Session) {
  const dashboard = await findDashboardById(id)

  return createDashboard(
    {
      name: dashboard.name + ' (copy)',
      description: dashboard.description ?? undefined,
      color: dashboard.color ?? undefined,
      icon: dashboard.icon ?? undefined,
      layout: dashboard.layout,
    },
    session,
  )
}

export async function findDashboardWithCharts(id: number) {
  const dashboard = await findDashboardById(id)

  const dashboardWithCharts = await db
    .select()
    .from(chartsToDashboards)
    .innerJoin(charts, eq(chartsToDashboards.chartId, charts.id))
    .innerJoin(dashboards, eq(chartsToDashboards.dashboardId, dashboards.id))
    .where(eq(dashboards.id, id))

  return {
    ...dashboard,
    charts: dashboardWithCharts.map((item) => item.charts),
  }
}

export async function updateDashboard(input: z.infer<typeof updateDashboardInput>) {
  const updatedDashboard = await db
    .update(dashboards)
    .set({
      name: input.name,
      description: input.description,
      color: input.color,
      icon: input.icon,
      layout: input.layout,
    })
    .where(eq(dashboards.id, input.id))
    .returning()

  return updatedDashboard[0]
}
