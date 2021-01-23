import { useCallback, useEffect } from 'react'
import usePersistedSetState from 'hooks/use-persisted-state'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { usePrevious } from 'hooks/use-previous'
import { difference } from 'lodash-es'
import { useQueryClient } from 'react-query'
import { Modal } from 'antd'
import { TabData } from '../types'
import { isTabUnsaved } from '../utils/tab'

export function useTabs(tabsData: Record<string, TabData>) {
  const [tabs, setTabs] = usePersistedSetState<string[]>(
    'query-editor-tabs',
    [],
  )
  const prevTabs = usePrevious(tabs)

  const { tabType, id } = useParams()
  const { state } = useLocation()

  useEffect(
    function updateTabStateOnRouteChange() {
      const isRouteReplaced =
        (state as null | { replace?: boolean })?.replace === true
      if (
        typeof tabType !== 'undefined' &&
        typeof id !== 'undefined' &&
        !isRouteReplaced
      ) {
        const tabRoute = `${tabType}/${id}`
        setTabs((prevTabs) => {
          if (prevTabs.includes(tabRoute)) {
            return prevTabs
          }
          return [...prevTabs, tabRoute]
        })
      }
    },
    [tabType, id, setTabs, state],
  )

  useEffect(
    function removeTabDataForClosedTabs() {
      // return all the tabs which are closed
      difference(prevTabs, tabs).forEach((tabRoute) => {
        // remove all the items from local storage for that tab
        Object.keys(window.localStorage).forEach((key) => {
          if (key.startsWith(tabRoute)) {
            window.localStorage.removeItem(tabRoute)
          }
        })
      })
    },
    [prevTabs, tabs],
  )

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  /**
   * Helper function to remove tab. This is called when the user clicks
   * on close button in the tab
   *
   * @param tabRoute - The route of the tab to be removed
   */
  const removeTab = useCallback(
    (tabRoute: string) => {
      function closeTab() {
        const activeTabRoute = `${tabType}/${id}`
        if (tabRoute === activeTabRoute) {
          const tabIndexToBeRemoved = tabs.indexOf(tabRoute)
          const nextIndex =
            tabIndexToBeRemoved !== 0
              ? tabIndexToBeRemoved - 1
              : tabs.length - 1
          const nextTabRoute = tabs[nextIndex]
          // if there only 1 tab left to closed then the nextTabRoute would be same as
          // tabRoute and this is going to closed, we can easily remove this tab
          if (nextTabRoute && nextTabRoute !== tabRoute) {
            navigate(`/queries/${nextTabRoute}`)
          } else {
            navigate('/queries/new')
          }
        }
        setTabs((prevTabs) => prevTabs.filter((tab) => tab !== tabRoute))
      }

      // check if tab has unsaved changes or not
      const originalTabData = queryClient.getQueryData([
        'tabs',
        tabRoute,
      ]) as TabData
      const tabData = tabsData[tabRoute]
      const tabUnsaved = isTabUnsaved(tabData, originalTabData)

      // @TODO add this to the setting, so that user could close multiple tabs
      // without seeing the modal
      if (tabUnsaved) {
        Modal.confirm({
          title: 'Close tab',
          content:
            'This query has unsaved changes. Are you sure you want to close it?',
          onOk: closeTab,
        })
      } else {
        closeTab()
      }
    },
    [navigate, tabType, id, tabs, setTabs, tabsData, queryClient],
  )

  /**
   * Helper function to update the route of the tab
   *
   * @param fromTabRoute - initial tab route
   * @param toTabRoute - destination tab route
   */
  const updateTabRoute = useCallback(
    (fromTabRoute: string, toTabRoute: string) => {
      const activeTabRoute = `${tabType}/${id}`
      if (activeTabRoute === fromTabRoute) {
        navigate(`/queries/${toTabRoute}`, {
          replace: true,
          state: { replace: true },
        })
      }
      setTabs((prevTabs) => {
        const tabFound = prevTabs.find((tab) => tab === fromTabRoute)
        if (!tabFound) {
          return prevTabs
        }
        return prevTabs.map((tab) => (tab === fromTabRoute ? toTabRoute : tab))
      })
    },
    [tabType, id, navigate, setTabs],
  )

  return {
    tabs,
    removeTab,
    updateTabRoute,
  }
}
