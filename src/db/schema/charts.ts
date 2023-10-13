import { integer, json, pgTable, serial, text, time } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { resources } from './resource'
import { users } from './auth'

export const charts = pgTable('charts', {
  id: serial('id').primaryKey(),
  createdAt: time('created_at').defaultNow(),
  query: text('query').notNull(),
  name: text('name').notNull(),
  config: json('config'),
  createdBy: text('user_id').references(() => users.id),
  resourceId: integer('resource_id').references(() => resources.id),
})

export const chartRelations = relations(charts, ({ one }) => ({
  createdBy: one(users, {
    fields: [charts.createdBy],
    references: [users.id],
  }),
  resourceId: one(resources, {
    fields: [charts.resourceId],
    references: [resources.id],
  }),
}))
