import { useCallback, useContext } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import TabDataContext from '../contexts/tab-data-context'
import fetchTabData from '../queries-and-mutations'

export function useTabData(tabRoute: string) {
  const { tabData, setTabData } = useContext(TabDataContext)
  const { query, resourceId, name } = tabData[tabRoute] ?? {}
  const [tabType, id] = tabRoute.split('/')

  const updateQuery = useCallback(
    (updatedQuery: string) => {
      setTabData((prevData) => {
        if (typeof prevData[tabRoute] === 'undefined') {
          return prevData
        }
        return {
          ...prevData,
          [tabRoute]: {
            ...prevData[tabRoute],
            query: updatedQuery,
          },
        }
      })
    },
    [tabRoute, setTabData],
  )

  const updateResourceId = useCallback(
    (updatedResourceId?: number) => {
      setTabData((prevData) => {
        if (typeof prevData[tabRoute] === 'undefined') {
          return prevData
        }
        return {
          ...prevData,
          [tabRoute]: {
            ...prevData[tabRoute],
            resourceId: updatedResourceId,
          },
        }
      })
    },
    [tabRoute, setTabData],
  )

  const updateName = useCallback(
    (updatedName: string) => {
      setTabData((prevData) => {
        if (typeof prevData[tabRoute] === 'undefined') {
          return prevData
        }
        return {
          ...prevData,
          [tabRoute]: {
            ...prevData[tabRoute],
            name: updatedName,
          },
        }
      })
    },
    [tabRoute, setTabData],
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

  const hasUnsavedChanges = originalTabData
    ? originalTabData.name !== name ||
      originalTabData.resourceId !== resourceId ||
      originalTabData.query !== query
    : false

  return {
    tabType,
    id,
    isLoadingTabData,
    originalTabDataError,
    hasUnsavedChanges,
    originalTabData,
    query,
    updateQuery,
    name,
    updateName,
    resourceId,
    updateResourceId,
  }
}
