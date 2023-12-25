import z from 'zod'
import { Session } from 'next-auth'
import { and, eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { addOrRemoveFromDashboardInput, createChartInput, updateChartInput } from './input'
import { db } from '@/db'
import { charts, chartsToDashboards } from '@/db/schema/charts'
import { resources } from '@/db/schema/resource'
import { findDashboardById } from '../dashboards/service'

export async function createChart(input: z.infer<typeof createChartInput>, session: Session) {
  const chartCreated = await db
    .insert(charts)
    .values({
      name: input.name,
      description: input.description,
      query: input.query,
      config: input.config,
      resourceId: input.resource,
      type: input.type,
      createdBy: session.user.id,
    })
    .returning()

  return chartCreated[0]
}

export async function getUserCharts(session: Session) {
  return db.select().from(charts).where(eq(charts.createdBy, session.user.id))
}

export async function findChartById(id: number) {
  const chartsFound = await db
    .select()
    .from(charts)
    .where(eq(charts.id, id))
    .leftJoin(resources, eq(charts.resourceId, resources.id))
  return chartsFound[0]
}

export async function deleteChart(id: number, session: Session) {
  const { charts: chart } = await findChartById(id)
  if (chart.createdBy !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to delete this chart!' })
  }
  return db.delete(charts).where(eq(charts.id, chart.id)).returning()
}

export async function duplicateChart(chartId: number, session: Session) {
  const { charts: chart } = await findChartById(chartId)
  return createChart(
    {
      name: `${chart.name} Copy`,
      query: chart.query,
      config: chart.config,
      resource: chart.resourceId!,
      type: chart.type!,
    },
    session,
  )
}

export async function updateChart(input: z.infer<typeof updateChartInput>, session: Session) {
  const { charts: chart } = await findChartById(input.id)
  if (chart.createdBy !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to update this chart!' })
  }

  const updatedChart = await db
    .update(charts)
    .set({
      name: input.name,
      description: input.description,
      query: input.query,
      config: input.config,
      type: input.type,
    })
    .where(eq(charts.id, input.id))
    .returning()
  return updatedChart[0]
}

export async function addToDashboard(input: z.infer<typeof addOrRemoveFromDashboardInput>, session: Session) {
  const { charts: chart } = await findChartById(input.chartId)
  const dashboard = await findDashboardById(input.dashboardId)

  if (chart.createdBy !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to add this chart to this dashboard!' })
  }

  if (dashboard.createdBy !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to add this chart to this dashboard!' })
  }

  const chartAlreadyAdded = await db
    .select()
    .from(chartsToDashboards)
    .where(and(eq(chartsToDashboards.chartId, chart.id), eq(chartsToDashboards.dashboardId, dashboard.id)))

  if (chartAlreadyAdded.length > 0) {
    throw new TRPCError({ code: 'CONFLICT', message: 'This chart is already added to the dashboard!' })
  }

  await db.insert(chartsToDashboards).values({
    chartId: chart.id,
    dashboardId: dashboard.id,
  })
}

export async function removeFromDashboard(input: z.infer<typeof addOrRemoveFromDashboardInput>, session: Session) {
  const { charts: chart } = await findChartById(input.chartId)
  const dashboard = await findDashboardById(input.dashboardId)

  if (chart.createdBy !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to remove this chart from this dashboard!' })
  }

  if (dashboard.createdBy !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to remove this chart from this dashboard!' })
  }

  const chartAlreadyAdded = await db
    .select()
    .from(chartsToDashboards)
    .where(and(eq(chartsToDashboards.chartId, chart.id), eq(chartsToDashboards.dashboardId, dashboard.id)))

  if (chartAlreadyAdded.length === 0) {
    throw new TRPCError({ code: 'CONFLICT', message: 'This chart is not added to the dashboard!' })
  }

  await db
    .delete(chartsToDashboards)
    .where(and(eq(chartsToDashboards.chartId, chart.id), eq(chartsToDashboards.dashboardId, dashboard.id)))
}
