import { eq } from 'drizzle-orm'
import { Session } from 'next-auth'
import z from 'zod'
import { TRPCError } from '@trpc/server'
import { db } from '@/db'
import { dashboards } from '@/db/schema/dashboards'
import { createDashboardInput, updateDashboardInput } from './input'
import { charts, chartsToDashboards } from '@/db/schema/charts'

export async function findUserDashboards(session: Session) {
  return db.select().from(dashboards).where(eq(dashboards.createdBy, session.user.id))
}

export async function createDashboard(input: z.infer<typeof createDashboardInput>, session: Session) {
  const dashboardCreated = await db
    .insert(dashboards)
    .values({
      ...input,
      createdBy: session.user.id,
    })
    .returning()

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

export async function deleteDashboard(id: number, session: Session) {
  const dashboard = await findDashboardById(id)

  if (dashboard.createdBy !== session.user.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to delete this dashboard!',
    })
  }

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

/** Find a dashboard with all its charts */
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

export async function updateDashboard(input: z.infer<typeof updateDashboardInput>, session: Session) {
  const dashboard = await findDashboardById(input.id)

  if (dashboard.createdBy !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to update this dashboard!' })
  }

  const updatedDashboard = await db
    .update(dashboards)
    .set({
      name: input.name,
      description: input.description,
      color: input.color,
      icon: input.icon,
      layout: input.layout,
    })
    .returning()

  return updatedDashboard[0]
}
