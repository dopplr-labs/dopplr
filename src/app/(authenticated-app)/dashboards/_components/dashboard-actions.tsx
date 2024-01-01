'use client'

import { MoreVerticalIcon, Share2Icon, Trash } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/components/ui/use-toast'
import ShareDashboard from './share-dashboard'
import When from '@/components/when'

type DashboardActionProps = {
  className?: string
  style?: React.CSSProperties
  dashboardId: number
}

export default function DashboardActions({ className, style, dashboardId }: DashboardActionProps) {
  const [shareOpen, setShareOpen] = useState(false)

  const utils = trpc.useContext()

  const dashboardUserQuery = trpc.dashboardUser.findDashboardUser.useQuery({ id: dashboardId })

  const deleteDashboardMutation = trpc.dashboards.delete.useMutation({
    onSuccess: () => {
      utils.dashboards.findUserDashboard.invalidate()
      toast({ title: 'Dashboard deleted successfully!' })
    },
    onError: (error) => {
      toast({ title: 'Something went wrong!', description: error?.message ?? '', variant: 'destructive' })
    },
  })

  if (dashboardUserQuery?.data?.role === 'VIEWER') {
    return null
  }

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={<MoreVerticalIcon />} variant="secondary" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className={className} style={style}>
          <When truthy={dashboardUserQuery?.data?.role === 'OWNER' || dashboardUserQuery?.data?.role === 'EDITOR'}>
            <DropdownMenuItem
              onClick={() => {
                setShareOpen(true)
              }}
            >
              <Share2Icon className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
          </When>

          <When truthy={dashboardUserQuery?.data?.role === 'OWNER'}>
            <DropdownMenuItem
              onClick={() => {
                deleteDashboardMutation.mutate({ id: dashboardId })
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </When>
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareDashboard open={shareOpen} onOpenChange={setShareOpen} dashboardId={dashboardId} />
    </Fragment>
  )
}
