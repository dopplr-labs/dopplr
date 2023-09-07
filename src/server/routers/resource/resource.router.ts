import { protectedProcedure, router } from '@/server/trpc'
import { createResourceSchema, testConnectionSchema } from './resource.schema'
import { createResource, testConnection } from './resource.service'

export const resourceRouter = router({
  testConnection: protectedProcedure.input(testConnectionSchema).mutation(({ input }) => testConnection(input)),
  createResource: protectedProcedure
    .input(createResourceSchema)
    .mutation(({ input, ctx: { session } }) => createResource(input, session)),
})
