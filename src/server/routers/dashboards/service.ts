import { eq } from 'drizzle-orm'
import { Session } from 'next-auth'
import { db } from '@/db'
import { dashboards } from '@/db/schema/dashboards'

export async function findUserDashboards(session: Session) {
  return db.select().from(dashboards).where(eq(dashboards.createdBy, session.user.id))
}
