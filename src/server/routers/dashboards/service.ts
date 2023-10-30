import { eq } from 'drizzle-orm'
import { Session } from 'next-auth'
import z from 'zod'
import { TRPCError } from '@trpc/server'
import { db } from '@/db'
import { dashboards } from '@/db/schema/dashboards'
import { createDashboardInput } from './input'

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
