import { protectedProcedure, router } from '@/server/trpc'
import { createResourceSchema, getResourceSchema, testConnectionSchema } from './resource.schema'
import { createResource, getResource, getResources, testConnection } from './resource.service'

export const resourceRouter = router({
  testConnection: protectedProcedure.input(testConnectionSchema).mutation(({ input }) => testConnection(input)),
  createResource: protectedProcedure
    .input(createResourceSchema)
    .mutation(({ input, ctx: { session } }) => createResource(input, session)),
  getResources: protectedProcedure.query(({ ctx: { session } }) => getResources(session)),
  getResource: protectedProcedure
    .input(getResourceSchema)
    .query(({ input, ctx: { session } }) => getResource(input, session)),
})
