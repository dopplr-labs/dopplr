'use client'

import { MoreVerticalIcon, Share2Icon, Trash } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/components/ui/use-toast'
import ShareDashboard from './share-dashboard'

type DashboardActionProps = {
  className?: string
  style?: React.CSSProperties
  dashboardId: number
}

export default function DashboardActions({ className, style, dashboardId }: DashboardActionProps) {
  const [shareOpen, setShareOpen] = useState(false)

  const utils = trpc.useContext()

  const deleteDashboardMutation = trpc.dashboards.delete.useMutation({
    onSuccess: () => {
      utils.dashboards.findUserDashboard.invalidate()
      toast({ title: 'Dashboard deleted successfully!' })
    },
    onError: (error) => {
      toast({ title: 'Something went wrong!', description: error?.message ?? '', variant: 'destructive' })
    },
  })

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={<MoreVerticalIcon />} variant="secondary" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className={className} style={style}>
          <DropdownMenuItem
            onClick={() => {
              setShareOpen(true)
            }}
          >
            <Share2Icon className="mr-2 h-4 w-4" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              deleteDashboardMutation.mutate({ id: dashboardId })
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareDashboard open={shareOpen} onOpenChange={setShareOpen} dashboardId={dashboardId} />
    </Fragment>
  )
}
