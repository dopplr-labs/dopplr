'use client'

import { useParams } from 'next/navigation'
import { match } from 'ts-pattern'
import React, { useState } from 'react'
import GridLayout from 'react-grid-layout'
import { PenSquareIcon, SaveIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { trpc } from '@/lib/trpc/client'
import { ErrorMessage } from '@/components/ui/error-message'
import ChartRenderer from '../_components/chart-renderer'
import { Skeleton } from '@/components/ui/skeleton'
import { generateDefaultLayout } from '@/lib/dashboards/utils'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import EditableInput from '@/components/ui/editable-input'
import DashboardActions from '../_components/dashboard-actions'

export default function DashboardDetails() {
  const { theme } = useTheme()
  const isDarkMode = theme?.endsWith('dark')
  const [isDashboardEditable, setIsDashboardEditable] = useState(false)

  /** We have to update data on save button click */
  const [dashboardData, setDashboardData] = useState<{
    name: string
    description: string
    layout: GridLayout.Layout[]
  }>({
    layout: [],
    name: '',
    description: '',
  })

  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const utils = trpc.useContext()

  const dashboardDetailsQuery = trpc.dashboards.findOneWithCharts.useQuery(
    { id: Number(id) },
    {
      onSuccess: (data) => {
        setDashboardData({
          layout: data.layout as GridLayout.Layout[],
          name: data.name,
          description: data?.description ?? '',
        })
      },
    },
  )

  const updateDashboardMutation = trpc.dashboards.update.useMutation({
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: 'Something went wrong while updating layout, please try again!',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Dashboard updated successfully!',
        variant: 'success',
      })
      setIsDashboardEditable(false)
      utils.dashboards.findUserDashboard.invalidate()
      utils.dashboards.findOneWithCharts.invalidate()
    },
  })

  return match(dashboardDetailsQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => (
      <div className="space-y-4 p-3">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="mb-1 h-8 w-96" />
            <Skeleton className="h-3 w-64" />
          </div>
          <div>
            <Skeleton className="h-10 w-40" />
          </div>
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
      const dashboardLayout = (data.layout ?? generateDefaultLayout(data.charts)) as GridLayout.Layout[]

      return (
        <div className="h-screen space-y-4 overflow-y-auto p-4">
          <div className="flex items-center justify-between">
            <div>
              <EditableInput
                className="text-2xl font-bold"
                editable={isDashboardEditable}
                value={dashboardData.name}
                onChange={(value) => {
                  setDashboardData((prev) => ({ ...prev, name: value }))
                }}
              />
              <EditableInput
                className="text-sm text-muted-foreground"
                editable={isDashboardEditable}
                value={dashboardData.description}
                onChange={(value) => {
                  setDashboardData((prev) => ({ ...prev, description: value }))
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              {isDashboardEditable ? (
                <Button
                  icon={<SaveIcon />}
                  loading={updateDashboardMutation.isLoading}
                  onClick={() => {
                    updateDashboardMutation.mutate({ id: data.id, ...dashboardData })
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  icon={<PenSquareIcon />}
                  onClick={() => {
                    setIsDashboardEditable(true)
                  }}
                >
                  Update Dashboard
                </Button>
              )}
              <DashboardActions dashboardId={data.id} />
            </div>
          </div>

          <GridLayout
            isDraggable={isDashboardEditable}
            isResizable={isDashboardEditable}
            layout={dashboardLayout}
            cols={12}
            rowHeight={30}
            width={1700}
            onLayoutChange={(layout) => {
              setDashboardData((prev) => ({ ...prev, layout }))
            }}
            className="min-h-[85vh] rounded-md bg-accent"
            style={{
              backgroundImage: isDarkMode ? 'url(/graph-dark.svg)' : 'url(/graph.svg)',
            }}
          >
            {data.charts.map((chart) => (
              <div key={chart.id.toString()}>
                <ChartRenderer chart={chart} dashboardId={data.id} />
              </div>
            ))}
          </GridLayout>
        </div>
      )
    })
    .exhaustive()
}
