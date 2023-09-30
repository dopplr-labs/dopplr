import { match } from 'ts-pattern'
import { trpc } from '@/lib/trpc/client'
import { range } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { simpleHash } from '@/lib/random/utils'
import { ErrorMessage } from '@/components/ui/error-message'
import SavedQueryItem from './saved-query-item'

export default function SavedQueriesTab() {
  const savedQueriesQuery = trpc.history.getSavedQueriesForUser.useQuery()

  return match(savedQueriesQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => {
      return (
        <div className="space-y-4 p-4">
          {range(5).map((key) => {
            return (
              <div className="flex items-center space-x-2" key={key}>
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-7" style={{ width: `${simpleHash(key)}%` }} />
              </div>
            )
          })}
        </div>
      )
    })
    .with({ status: 'error' }, ({ error }) => {
      return (
        <ErrorMessage
          title="Error fetching resources"
          description={error.message ?? 'Something went wrong. Please try again later.'}
        />
      )
    })
    .with({ status: 'success' }, ({ data: savedQueries }) => {
      return (
        <div className="font-mono">
          {savedQueries.map((item) => (
            <SavedQueryItem key={item.id} item={item} />
          ))}
        </div>
      )
    })
    .exhaustive()
}
