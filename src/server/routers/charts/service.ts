import z from 'zod'
import { Session } from 'next-auth'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { createChartInput } from './input'
import { db } from '@/db'
import { charts } from '@/db/schema/charts'

export async function createChart(input: z.infer<typeof createChartInput>, session: Session) {
  const chartCreated = await db
    .insert(charts)
    .values({
      name: input.name,
      query: input.query,
      config: input.config,
      resourceId: input.resource,
      createdBy: session.user.id,
    })
    .returning()

  return chartCreated[0]
}

export async function getUserCharts(session: Session) {
  return db.select().from(charts).where(eq(charts.createdBy, session.user.id))
}

export async function findChartById(id: number) {
  const chartsFound = await db.select().from(charts).where(eq(charts.id, id))
  return chartsFound[0]
}

export async function deleteChart(id: number, session: Session) {
  const chart = await findChartById(id)
  if (chart.createdBy !== session.user.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not allowed to delete this chart!' })
  }
  return db.delete(charts).where(eq(charts.id, chart.id)).returning()
}

export async function duplicateChart(chartId: number, session: Session) {
  const chart = await findChartById(chartId)
  return createChart(
    {
      name: `${chart.name} Copy`,
      query: chart.query,
      config: chart.config,
      resource: chart.resourceId!,
    },
    session,
  )
}
