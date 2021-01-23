import { useCallback, useContext } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import TabsDataContext from '../contexts/tabs-data-context'
import fetchTabData from '../queries-and-mutations'
import { isTabUnsaved } from '../utils/tab'

export function useTabData(tabRoute: string) {
  const { tabsData, setTabsData } = useContext(TabsDataContext)
  const { query, resourceId, name } = tabsData[tabRoute] ?? {}
  const [tabType, id] = tabRoute.split('/')

  const updateQuery = useCallback(
    (updatedQuery: string) => {
      setTabsData((prevData) => {
        if (prevData[tabRoute]?.query === updatedQuery) {
          return prevData
        }
        return {
          ...prevData,
          [tabRoute]: {
            ...(prevData[tabRoute] ?? {}),
            query: updatedQuery,
          },
        }
      })
    },
    [tabRoute, setTabsData],
  )

  const updateResourceId = useCallback(
    (updatedResourceId?: number) => {
      setTabsData((prevData) => {
        if (prevData[tabRoute]?.resourceId === updatedResourceId) {
          return prevData
        }
        return {
          ...prevData,
          [tabRoute]: {
            ...(prevData[tabRoute] ?? {}),
            resourceId: updatedResourceId,
          },
        }
      })
    },
    [tabRoute, setTabsData],
  )

  const updateName = useCallback(
    (updatedName: string) => {
      setTabsData((prevData) => {
        if (prevData[tabRoute]?.name === updatedName) {
          return prevData
        }
        return {
          ...prevData,
          [tabRoute]: {
            ...(prevData[tabRoute] ?? {}),
            name: updatedName,
          },
        }
      })
    },
    [tabRoute, setTabsData],
  )

  const queryClient = useQueryClient()
  const {
    data: originalTabData,
    isLoading: isLoadingTabData,
    error: originalTabDataError,
  } = useQuery(['tabs', tabRoute], () => fetchTabData(queryClient, tabRoute), {
    refetchOnMount: true,
    onSettled: (data) => {
      if (!data) {
        return
      }

      if (typeof query === 'undefined') {
        updateQuery(data.query)
      }

      if (typeof resourceId === 'undefined') {
        updateResourceId(data.resourceId)
      }

      if (typeof name === 'undefined') {
        updateName(data.name)
      }
    },
  })

  return {
    tabType,
    id,
    isLoadingTabData,
    originalTabDataError,
    hasUnsavedChanges: isTabUnsaved(
      { query, name, resourceId },
      originalTabData,
    ),
    originalTabData,
    query,
    updateQuery,
    name,
    updateName,
    resourceId,
    updateResourceId,
  }
}
