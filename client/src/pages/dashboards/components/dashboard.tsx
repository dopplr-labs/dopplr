import React, { useCallback, useMemo } from 'react'
import { Button, Dropdown, Menu, Modal, Result, Spin } from 'antd'
import { SettingOutlined, ShareAltOutlined } from '@ant-design/icons'
import GridLayout from 'react-grid-layout'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import useMeasure from 'react-use-measure'
import Spinner from 'components/spinner'
import { Category } from 'types/category'
import Chart from './chart'
import { deleteDashboard, fetchDashboard, updateDashboard } from '../queries'

export default function Dashboard() {
  const { dashboardId } = useParams()
  const navigate = useNavigate()
  const [measureContainer, containerBounds] = useMeasure()

  const { data: dashboard, isLoading, error } = useQuery(
    ['dashboard', dashboardId],
    () => fetchDashboard(parseInt(dashboardId)),
  )

  const queryClient = useQueryClient()

  const { mutate: editDashboard } = useMutation(updateDashboard)

  const {
    mutate: removeDashboard,
    isLoading: isDeletingDashboard,
  } = useMutation(deleteDashboard, {
    onSuccess: (deletedDashboard) => {
      queryClient.removeQueries(['dashboard', deletedDashboard.id])
      queryClient.setQueryData(
        ['categories'],
        (categories: Category[] | undefined) =>
          categories?.map((category) => ({
            ...category,
            dashboards: category.dashboards?.filter(
              (dashboard) => dashboard.id !== deletedDashboard.id,
            ),
          })) as Category[],
      )
      const categories: Category[] | undefined = queryClient.getQueryData([
        'categories',
      ])

      navigate(`/dashboards/${categories?.[0].dashboards?.[0].id ?? ''}`)
    },
  })

  const handleUpdateDashboard = useCallback(
    (layout) => {
      editDashboard({ id: parseInt(dashboardId), layout })
    },
    [dashboardId, editDashboard],
  )

  const confirmDelete = useCallback(() => {
    Modal.confirm({
      title: 'Delete this dashboard?',
      content: 'This action cannot be reverted',
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: { loading: isDeletingDashboard },
      onOk() {
        removeDashboard(parseInt(dashboardId))
      },
    })
  }, [dashboardId, removeDashboard, isDeletingDashboard])

  const settingsMenu = useMemo(
    () => (
      <Menu>
        <Menu.Item key="0" className="text-sm" onClick={confirmDelete}>
          Delete Dashboard
        </Menu.Item>
      </Menu>
    ),
    [confirmDelete],
  )

  const dashboardContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <Spin tip="Loading Dashboard..." indicator={<Spinner />} />
        </div>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    if (dashboard) {
      return (
        <div className="w-full" ref={measureContainer}>
          <div className="flex items-center justify-start py-2 mx-2 -mt-6 space-x-2">
            <div className="flex flex-col space-y-1">
              <span className="font-semibold text-brand-primary">
                {dashboard.name}
              </span>
              <span className="text-xs text-gray-500">
                {dashboard.description}
              </span>
            </div>
            <div className="flex-1" />
            <Button icon={<ShareAltOutlined />} />
            <Dropdown overlay={settingsMenu} trigger={['click']}>
              <Button icon={<SettingOutlined />} />
            </Dropdown>
          </div>
          {dashboard.layout ? (
            <GridLayout
              layout={dashboard.layout}
              rowHeight={80}
              cols={12}
              width={containerBounds.width}
              onResizeStop={handleUpdateDashboard}
              onDragStop={handleUpdateDashboard}
            >
              {dashboard.charts?.map((chart) => (
                <div key={chart.id}>
                  <Chart
                    dashboardChartId={chart.id}
                    dashboardId={dashboardId}
                  />
                </div>
              ))}
            </GridLayout>
          ) : null}
        </div>
      )
    }
  }, [
    dashboard,
    error,
    isLoading,
    measureContainer,
    containerBounds.width,
    settingsMenu,
    handleUpdateDashboard,
    dashboardId,
  ])

  return <>{dashboardContent}</>
}
