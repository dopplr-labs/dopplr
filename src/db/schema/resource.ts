import { pgTable, text, json, time, serial } from 'drizzle-orm/pg-core'
import { InferSelectModel, relations } from 'drizzle-orm'
import { users } from './auth'
import { charts } from './charts'

export const resources = pgTable('resource', {
  id: serial('id').primaryKey(),
  createdAt: time('created_at').defaultNow(),
  createdBy: text('created_by').references(() => users.id),
  name: text('name').notNull(),
  type: text('type', { enum: ['postgres', 'mysql'] }).notNull(),
  connectionConfig: json('connection_config').notNull(),
})

export type Resource = InferSelectModel<typeof resources>

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [resources.createdBy],
    references: [users.id],
  }),
  charts: many(charts),
}))
