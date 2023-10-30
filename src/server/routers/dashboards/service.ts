import { eq } from 'drizzle-orm'
import { Session } from 'next-auth'
import z from 'zod'
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
