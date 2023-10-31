'use client'

import { useParams } from 'next/navigation'
import { match } from 'ts-pattern'
import React from 'react'
import { trpc } from '@/lib/trpc/client'
import { ErrorMessage } from '@/components/ui/error-message'

export default function DashboardDetails() {
  const { id } = useParams<{ id: string }>()

  const dashboardDetailsQuery = trpc.dashboards.findOneWithCharts.useQuery({ id: Number(id) })

  return match(dashboardDetailsQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => <div>TODO: Skeleton Loader</div>)
    .with({ status: 'error' }, ({ error }) => (
      <ErrorMessage title="Something went wrong!" description={error?.message ?? 'Dashboard details may not exists!'} />
    ))
    .with({ status: 'success' }, ({ data }) => {
      return (
        <div className="space-y-4 p-4">
          <div>
            <div className="text-2xl font-bold">{data.name}</div>
            <div className="text-sm text-muted-foreground">{data.description}</div>
          </div>
        </div>
      )
    })
    .exhaustive()
}
