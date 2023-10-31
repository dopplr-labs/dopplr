'use client'

import { useParams } from 'next/navigation'
import { match } from 'ts-pattern'
import React from 'react'
import { trpc } from '@/lib/trpc/client'
import { ErrorMessage } from '@/components/ui/error-message'
import ChartRenderer from '../_components/chart-renderer'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardDetails() {
  const { id } = useParams<{ id: string }>()

  const dashboardDetailsQuery = trpc.dashboards.findOneWithCharts.useQuery({ id: Number(id) })

  return match(dashboardDetailsQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => (
      <div className="space-y-4 p-3">
        <div>
          <Skeleton className="mb-1 h-8 w-96" />
          <Skeleton className="h-3 w-64" />
        </div>

        <div className="grid h-[85vh] w-full grid-cols-2 gap-4">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <ErrorMessage title="Something went wrong!" description={error?.message ?? 'Dashboard details may not exists!'} />
    ))
    .with({ status: 'success' }, ({ data }) => {
      return (
        <div className="space-y-4 overflow-y-auto p-4">
          <div>
            <div className="text-2xl font-bold">{data.name}</div>
            <div className="text-sm text-muted-foreground">{data.description}</div>
          </div>

          {data.charts.map((chart) => (
            <ChartRenderer key={chart.id} chart={chart} />
          ))}
        </div>
      )
    })
    .exhaustive()
}
