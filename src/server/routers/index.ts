import { router } from '../trpc'
import { resourceRouter } from './resource/resource.router'

export const appRouter = router({
  resource: resourceRouter,
})

export type AppRouter = typeof appRouter
