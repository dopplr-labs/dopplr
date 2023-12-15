import { protectedProcedure, router } from '@/server/trpc'
import { formatQueryInput, runQueryInput } from './input'
import { formatQuery, runQuery } from './service'

export const queryRouter = router({
  /**
   * Sometimes we need to run the query as soon the component mounts and sometimes based on the user
   * action. Running the query on component mount is suitable for query and running the query on user
   * is suitable for mutation. So we have both procedure
   */
  runQuery: protectedProcedure.input(runQueryInput).query(({ input }) => runQuery(input)),
  runQueryMutation: protectedProcedure.input(runQueryInput).mutation(({ input }) => runQuery(input)),
  formatQuery: protectedProcedure.input(formatQueryInput).mutation(({ input }) => formatQuery(input)),
})
