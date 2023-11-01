import { json, pgTable, serial, text, time, varchar } from 'drizzle-orm/pg-core'
import { InferSelectModel, relations } from 'drizzle-orm'
import { users } from './auth'
import { chartsToDashboards } from './charts'

export const dashboards = pgTable('dashboards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  icon: varchar('icon'),
  color: varchar('color'),
  layout: json('layout'),
  createdAt: time('created_at').defaultNow(),
  createdBy: text('user_id').references(() => users.id),
})

export type Dashboard = InferSelectModel<typeof dashboards>

export const dashboardRelations = relations(dashboards, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [dashboards.createdBy],
    references: [users.id],
  }),
  chartsToDashboards: many(chartsToDashboards),
}))
