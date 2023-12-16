import { createTRPCReact } from '@trpc/react-query'
import { inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '@/server/routers'

type RouterOutputs = inferRouterOutputs<AppRouter>

export type ResourceGetOutput = RouterOutputs['resource']['getResource']

export const trpc = createTRPCReact<AppRouter>({})
