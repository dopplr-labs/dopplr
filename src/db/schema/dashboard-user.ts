import { integer, pgEnum, pgTable, serial, text, time, timestamp } from 'drizzle-orm/pg-core'
import { InferSelectModel, relations } from 'drizzle-orm'
import { users } from './auth'
import { dashboards } from './dashboards'

export const dashboardUserRole = pgEnum('dashboard_user_role', ['EDITOR', 'VIEWER', 'OWNER'])
export const dashboardInviteStatus = pgEnum('dashboard_invite_status', ['CONFIRMED', 'NOT_CONFIRMED'])

/** Dashboard Invitations */
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
  expireOn: timestamp('expire_on').notNull(),
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

/** Dashboard User */
export const dashboardUser = pgTable('dashboard_user', {
  id: serial('id').primaryKey(),
  createdAt: time('created_at').defaultNow(),
  user: text('user')
    .references(() => users.id)
    .notNull(),
  dashboard: integer('dashboard')
    .references(() => dashboards.id)
    .notNull(),
  role: dashboardUserRole('role').notNull(),
})
export type DashboardUser = InferSelectModel<typeof dashboardUser>

export const dashboardUserRelations = relations(dashboardUser, ({ one }) => ({
  user: one(users, {
    fields: [dashboardUser.user],
    references: [users.id],
  }),
  dashboard: one(dashboards, {
    fields: [dashboardUser.dashboard],
    references: [dashboards.id],
  }),
}))
