import { protectedProcedure, router } from '@/server/trpc'
import { testConnectionSchema } from './resource.schema'
import { testConnection } from './resource.service'

export const resourceRouter = router({
  testConnection: protectedProcedure.input(testConnectionSchema).mutation(({ input }) => testConnection(input)),
})
