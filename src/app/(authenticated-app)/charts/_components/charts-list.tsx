import React from 'react'
import { match } from 'ts-pattern'
import { trpc } from '@/lib/trpc/client'
import { range } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { simpleHash } from '@/lib/random/utils'
import { ErrorMessage } from '@/components/ui/error-message'
import { EmptyMessage } from '@/components/ui/empty-message'

export default function ChartList() {
  const chartsQuery = trpc.charts.getUserCharts.useQuery()

  return match(chartsQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => (
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
    ))
    .with({ status: 'error' }, ({ error }) => {
      return (
        <ErrorMessage
          title="Error fetching resources"
          description={error.message ?? 'Something went wrong. Please try again later.'}
        />
      )
    })
    .with({ status: 'success' }, ({ data: charts }) => {
      if (charts.length === 0) {
        return <EmptyMessage title="No charts created yet!" description="Try creating a new chart." />
      }

      return charts.map((chart) => (
        <div key={chart.id} className="cursor-pointer select-none truncate border-b px-4 py-2 text-sm hover:bg-muted">
          {chart.name}
        </div>
      ))
    })
    .exhaustive()
}
