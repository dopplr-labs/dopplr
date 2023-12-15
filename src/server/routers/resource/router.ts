import { protectedProcedure, router } from '@/server/trpc'
import { createResourceInput, deleteResourceInput, getResourceInput, updateResourceInput } from './input'
import { createResource, deleteResource, getResource, getResources, updateResource } from './service'

export const resourceRouter = router({
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
