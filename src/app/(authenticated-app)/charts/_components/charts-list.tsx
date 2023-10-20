'use client '

import React from 'react'
import { match } from 'ts-pattern'
import { RepeatIcon, Trash } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { range } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { simpleHash } from '@/lib/random/utils'
import { ErrorMessage } from '@/components/ui/error-message'
import { EmptyMessage } from '@/components/ui/empty-message'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { useToast } from '@/components/ui/use-toast'
import NavLink from './nav-link'

export default function ChartsList() {
  const { toast } = useToast()

  const chartsQuery = trpc.charts.getUserCharts.useQuery()

  const deleteChartMutation = trpc.charts.delete.useMutation({
    onSuccess: () => {
      chartsQuery.refetch()
      toast({ title: 'Chart deleted successfully!' })
    },
  })

  const duplicateChartMutation = trpc.charts.duplicate.useMutation({
    onSuccess: () => {
      chartsQuery.refetch()
      toast({ title: 'Chart duplicated successfully!' })
    },
  })

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
        <ContextMenu key={chart.id}>
          <ContextMenuTrigger asChild>
            <NavLink label={chart.name} href={`/charts/${chart.id}`} />
          </ContextMenuTrigger>
          <ContextMenuContent className="min-w-[12rem]">
            <ContextMenuItem
              disabled={duplicateChartMutation.isLoading}
              className="cursor-pointer"
              onClick={(event) => {
                event.stopPropagation()
                duplicateChartMutation.mutate({ id: chart.id })
              }}
            >
              <span className="flex-1">Duplicate Chart</span>
              <RepeatIcon className="h-4 w-4" />
            </ContextMenuItem>
            <ContextMenuItem
              disabled={deleteChartMutation.isLoading}
              className="cursor-pointer"
              onClick={(event) => {
                event.stopPropagation()
                deleteChartMutation.mutate({ id: chart.id })
              }}
            >
              <span className="flex-1">Delete Chart</span>
              <Trash className="h-4 w-4" />
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))
    })
    .exhaustive()
}
