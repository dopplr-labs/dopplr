import React, { useState, useEffect, useCallback } from 'react'
import { getDataFromLocalStorage } from 'utils/local-storage'

export function usePersistedSetState<T extends any>(
  key: string,
  initialState: T,
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const [state, setState] = useState(() =>
    getDataFromLocalStorage(key, initialState),
  )

  useEffect(
    function updateStateOnKeyChange() {
      setState(getDataFromLocalStorage(key, initialState))
    },
    // use JSON.stringify instead of direct initial state to prevent infinite loop
    // as this hook would always be called because of shallow comparision
    // eslint-disable-next-line
    [key, JSON.stringify(initialState)],
  )

  useEffect(
    function persistDataToStorage() {
      window.localStorage.setItem(key, JSON.stringify(state))
    },
    [key, state],
  )

  const clearCache = useCallback(() => {
    window.localStorage.removeItem(key)
  }, [key])

  return [state, setState, clearCache]
}

export default usePersistedSetState
