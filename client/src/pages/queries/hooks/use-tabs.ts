import { useCallback, useEffect } from 'react'
import usePersistedSetState from 'hooks/use-persisted-state'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { usePrevious } from 'hooks/use-previous'
import { difference } from 'lodash-es'

export function useTabs() {
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

  /**
   * Helper function to remove tab. This is called when the user clicks
   * on close button in the tab
   *
   * @param tabRoute - The route of the tab to be removed
   */
  const removeTab = useCallback(
    (tabRoute: string) => {
      const activeTabRoute = `${tabType}/${id}`
      if (tabRoute === activeTabRoute) {
        const tabIndexToBeRemoved = tabs.indexOf(tabRoute)
        const nextIndex =
          tabIndexToBeRemoved !== 0 ? tabIndexToBeRemoved - 1 : tabs.length - 1
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
    },
    [navigate, setTabs, tabs, tabType, id],
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
