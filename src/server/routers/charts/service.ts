import z from 'zod'
import { Session } from 'next-auth'
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
