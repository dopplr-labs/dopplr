import { pgTable, text, json, time, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './auth'

export const resources = pgTable('resource', {
  id: text('id').notNull().primaryKey(),
  createdAt: time('created_at').defaultNow(),
  createdBy: integer('created_by').references(() => users.id),
  type: text('type', { enum: ['postgres'] }).notNull(),
  connectionConfig: json('connection_config').notNull(),
})

export const resourcesRelations = relations(resources, ({ one }) => ({
  createdBy: one(users, {
    fields: [resources.createdBy],
    references: [users.id],
  }),
}))
