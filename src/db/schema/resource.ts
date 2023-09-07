import { pgTable, text, json, time, serial } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './auth'

export const resources = pgTable('resource', {
  id: serial('id').primaryKey(),
  createdAt: time('created_at').defaultNow(),
  createdBy: text('created_by').references(() => users.id),
  name: text('name').notNull(),
  type: text('type', { enum: ['postgres'] }).notNull(),
  connectionConfig: json('connection_config').notNull(),
})

export const resourcesRelations = relations(resources, ({ one }) => ({
  createdBy: one(users, {
    fields: [resources.createdBy],
    references: [users.id],
  }),
}))
