import { integer, pgEnum, pgTable, serial, text, time } from 'drizzle-orm/pg-core'
import { InferSelectModel, relations } from 'drizzle-orm'
import { users } from './auth'
import { resources } from './resource'

export const historyType = pgEnum('history_type', ['SAVED_QUERY', 'HISTORY'])

export const history = pgTable('history', {
  id: serial('id').primaryKey(),
  createdAt: time('created_at').defaultNow(),
  query: text('query').notNull(),
  name: text('name'),
  type: historyType('type').default('HISTORY'),
  createdBy: text('user_id').references(() => users.id),
  resourceId: integer('resource_id').references(() => resources.id),
})

export type History = InferSelectModel<typeof history>

export const historyRelations = relations(history, ({ one }) => ({
  createdBy: one(users, {
    fields: [history.createdBy],
    references: [users.id],
  }),
  resourceId: one(resources, {
    fields: [history.resourceId],
    references: [resources.id],
  }),
}))
