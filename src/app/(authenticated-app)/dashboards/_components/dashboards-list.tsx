'use client'

import React from 'react'
import { match } from 'ts-pattern'
import { PlusIcon, RepeatIcon, Trash } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { Skeleton } from '@/components/ui/skeleton'
import { range } from '@/lib/utils'
import { simpleHash } from '@/lib/random/utils'
import { ErrorMessage } from '@/components/ui/error-message'
import { EmptyMessage } from '@/components/ui/empty-message'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import NavLink from './nav-link'
import CreateDashboardDialog from './create-dashboard-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function DashboardsList() {
  const { toast } = useToast()
  const dashboardsQuery = trpc.dashboards.findUserDashboard.useQuery()

  const deleteDashboardMutation = trpc.dashboards.delete.useMutation({
    onSuccess: () => {
      dashboardsQuery.refetch()

      toast({ title: 'Dashboard deleted successfully!' })
    },
  })

  return match(dashboardsQuery)
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
    .with({ status: 'success' }, ({ data: dashboards }) => {
      if (dashboards.length === 0) {
        return (
          <EmptyMessage
            title="No dashboard created yet!"
            description={
              <div>
                <div className="mb-2">Try creating a new dashboard.</div>
                <CreateDashboardDialog trigger={<Button icon={<PlusIcon />}>Create Dashboard</Button>} />
              </div>
            }
          />
        )
      }

      return dashboards.map((dashboard) => (
        <ContextMenu key={dashboard.id}>
          <ContextMenuTrigger>
            <NavLink label={dashboard.name} href={`/dashboards/${dashboard.id}`} />
          </ContextMenuTrigger>
          <ContextMenuContent className="min-w-[12rem]">
            <ContextMenuItem
              className="cursor-pointer"
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <span className="flex-1">Duplicate Dashboard</span>
              <RepeatIcon className="h-4 w-4" />
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={(event) => {
                event.stopPropagation()
                deleteDashboardMutation.mutate({ id: dashboard.id })
              }}
            >
              <span className="flex-1">Delete Dashboard</span>
              <Trash className="h-4 w-4" />
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))
    })
    .exhaustive()
}
