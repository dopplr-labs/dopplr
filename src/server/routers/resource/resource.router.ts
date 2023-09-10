import { protectedProcedure, router } from '@/server/trpc'
import {
  createResourceSchema,
  deleteResourceSchema,
  getResourceSchema,
  testConnectionSchema,
  updateResourceSchema,
} from './resource.schema'
import {
  createResource,
  deleteResource,
  getResource,
  getResources,
  testConnection,
  updateResource,
} from './resource.service'

export const resourceRouter = router({
  testConnection: protectedProcedure.input(testConnectionSchema).mutation(({ input }) => testConnection(input)),
  createResource: protectedProcedure
    .input(createResourceSchema)
    .mutation(({ input, ctx: { session } }) => createResource(input, session)),
  updateResource: protectedProcedure
    .input(updateResourceSchema)
    .mutation(({ input, ctx: { session } }) => updateResource(input, session)),
  getResources: protectedProcedure.query(({ ctx: { session } }) => getResources(session)),
  getResource: protectedProcedure
    .input(getResourceSchema)
    .query(({ input, ctx: { session } }) => getResource(input, session)),
  deleteResource: protectedProcedure
    .input(deleteResourceSchema)
    .mutation(({ input, ctx: { session } }) => deleteResource(input, session)),
})
