import { router } from '../trpc'
import { historyRouter } from './history/router'
import { queryRouter } from './query/router'
import { resourceRouter } from './resource/router'

export const appRouter = router({
  resource: resourceRouter,
  query: queryRouter,
  history: historyRouter,
})

export type AppRouter = typeof appRouter
