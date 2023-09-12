import { router } from '../trpc'
import { queryRouter } from './query/router'
import { resourceRouter } from './resource/router'

export const appRouter = router({
  resource: resourceRouter,
  query: queryRouter,
})

export type AppRouter = typeof appRouter
