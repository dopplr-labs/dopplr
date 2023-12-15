import { integer, json, pgEnum, pgTable, primaryKey, serial, text, time } from 'drizzle-orm/pg-core'
import { InferSelectModel, relations } from 'drizzle-orm'
import { resources } from './resource'
import { users } from './auth'
import { dashboards } from './dashboards'

export const chartType = pgEnum('chart_type', [
  'BAR_CHART',
  'COLUMN_CHART',
  'PIE_CHART',
  'LINE_CHART',
  'AREA_CHART',
  'GAUGE_CHART',
  'SCATTER_CHART',
  'HEAT_MAP',
  'STAT_CARD',
])

export const charts = pgTable('charts', {
  id: serial('id').primaryKey(),
  createdAt: time('created_at').defaultNow(),
  query: text('query').notNull(),
  name: text('name').notNull(),
  config: json('config'),
  type: chartType('chart_type'),
  createdBy: text('user_id').references(() => users.id),
  resourceId: integer('resource_id').references(() => resources.id),
})

export type Chart = InferSelectModel<typeof charts>

export const chartRelations = relations(charts, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [charts.createdBy],
    references: [users.id],
  }),
  resourceId: one(resources, {
    fields: [charts.resourceId],
    references: [resources.id],
  }),
  chartsToDashboards: many(chartsToDashboards),
}))

export const chartsToDashboards = pgTable(
  'charts_to_dashboards',
  {
    chartId: integer('chart_id')
      .notNull()
      .references(() => charts.id),
    dashboardId: integer('dashboard_id')
      .notNull()
      .references(() => dashboards.id),
  },
  (t) => ({
    pk: primaryKey(t.chartId, t.dashboardId),
  }),
)

export const chartsToDashboardsRelations = relations(chartsToDashboards, ({ one }) => ({
  dashboard: one(dashboards, {
    fields: [chartsToDashboards.dashboardId],
    references: [dashboards.id],
  }),
  chart: one(charts, {
    fields: [chartsToDashboards.chartId],
    references: [charts.id],
  }),
}))
