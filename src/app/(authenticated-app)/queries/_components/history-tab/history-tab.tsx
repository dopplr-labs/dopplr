import { match } from 'ts-pattern'
import { trpc } from '@/lib/trpc/client'
import { Skeleton } from '@/components/ui/skeleton'
import { range } from '@/lib/utils'
import { simpleHash } from '@/lib/random/utils'
import { ErrorMessage } from '@/components/ui/error-message'
import HistoryTabItem from './history-tab-item'
import { EmptyMessage } from '@/components/ui/empty-message'

export default function HistoryTab() {
  const getHistoryQuery = trpc.history.getHistoryForUser.useQuery()

  return match(getHistoryQuery)
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
    .with({ status: 'success' }, ({ data: history }) => {
      if (history.length === 0) {
        return <EmptyMessage title="Nothing in history!" description="Try running a query" />
      }

      return (
        <div className="custom-scrollbar h-full overflow-auto font-mono">
          {history.map((item) => (
            <HistoryTabItem key={item.id} item={item} />
          ))}
        </div>
      )
    })
    .exhaustive()
}
