import { protectedProcedure, router } from '@/server/trpc'
import {
  createResourceInput,
  deleteResourceInput,
  getResourceInput,
  testConnectionInput,
  updateResourceInput,
} from './input'
import { createResource, deleteResource, getResource, getResources, testConnection, updateResource } from './service'

export const resourceRouter = router({
  testConnection: protectedProcedure.input(testConnectionInput).mutation(({ input }) => testConnection(input)),
  createResource: protectedProcedure
    .input(createResourceInput)
    .mutation(({ input, ctx: { session } }) => createResource(input, session)),
  updateResource: protectedProcedure
    .input(updateResourceInput)
    .mutation(({ input, ctx: { session } }) => updateResource(input, session)),
  getResources: protectedProcedure.query(({ ctx: { session } }) => getResources(session)),
  getResource: protectedProcedure
    .input(getResourceInput)
    .query(({ input, ctx: { session } }) => getResource(input, session)),
  deleteResource: protectedProcedure
    .input(deleteResourceInput)
    .mutation(({ input, ctx: { session } }) => deleteResource(input, session)),
})
