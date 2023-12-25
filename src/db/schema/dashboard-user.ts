import { integer, pgEnum, pgTable, serial, text, time } from 'drizzle-orm/pg-core'
import { InferSelectModel, relations } from 'drizzle-orm'
import { users } from './auth'
import { dashboards } from './dashboards'

export const dashboardUserRole = pgEnum('dashboard_user_role', ['EDITOR', 'VIEWER', 'OWNER'])
export const dashboardInviteStatus = pgEnum('dashboard_invite_status', ['CONFIRMED', 'NOT_CONFIRMED'])

export const dashboardUserInvite = pgTable('dashboard_user_invite', {
  id: serial('id').primaryKey(),
  createdAt: time('created_at').defaultNow(),
  from: text('from')
    .references(() => users.id)
    .notNull(),
  to: text('to')
    .references(() => users.id)
    .notNull(),
  dashboard: integer('dashboard')
    .references(() => dashboards.id)
    .notNull(),
  role: dashboardUserRole('role').notNull(),
  status: dashboardInviteStatus('status').default('NOT_CONFIRMED').notNull(),
  // An invitation will expire in 10days
  expriesOn: time('epries_on').notNull(),
})
export type DashboardUserInvite = InferSelectModel<typeof dashboardUserInvite>

export const dashboardUserInviteRelations = relations(dashboardUserInvite, ({ one }) => ({
  from: one(users, {
    fields: [dashboardUserInvite.from],
    references: [users.id],
  }),
  to: one(users, {
    fields: [dashboardUserInvite.to],
    references: [users.id],
  }),
  dashboard: one(dashboards, {
    fields: [dashboardUserInvite.dashboard],
    references: [dashboards.id],
  }),
}))
