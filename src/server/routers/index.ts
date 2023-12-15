import { router } from '../trpc'
import { chartsRouter } from './charts/router'
import { dashboardsRouter } from './dashboards/router'
import { historyRouter } from './history/router'
import { queryRouter } from './query/router'
import { resourceRouter } from './resource/router'

export const appRouter = router({
  resource: resourceRouter,
  query: queryRouter,
  history: historyRouter,
  charts: chartsRouter,
  dashboards: dashboardsRouter,
})

export type AppRouter = typeof appRouter
