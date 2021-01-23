import React, { useState, useEffect, useCallback } from 'react'
import { CacheImplementation, LocalStorageCache } from 'utils/cache'
import { getDataFromLocalStorage } from 'utils/local-storage'

export function usePersistedSetState<T extends any>(
  key: string,
  initialState: T,
  cache: CacheImplementation = new LocalStorageCache(),
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const [state, setState] = useState(() =>
    getDataFromLocalStorage(key, initialState),
  )

  useEffect(
    function updateStateOnKeyChange() {
      setState(cache.getData(key, initialState))
    },
    // use JSON.stringify instead of direct initial state to prevent infinite loop
    // as this hook would always be called because of shallow comparision
    // eslint-disable-next-line
    [key, JSON.stringify(initialState)],
  )

  useEffect(
    function persistDataToStorage() {
      cache.setData(key, state)
    },
    [cache, key, state],
  )

  const clearCache = useCallback(() => {
    cache.clearData(key)
  }, [cache, key])

  return [state, setState, clearCache]
}

export default usePersistedSetState
