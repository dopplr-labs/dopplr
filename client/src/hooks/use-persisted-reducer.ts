import React, { useReducer, useEffect } from 'react'
import { getDataFromLocalStorage } from 'utils/local-storage'

const usePersistedReducer = <T extends React.Reducer<any, any>>({
  reducer,
  initialState,
  initializer,
  key,
}: {
  reducer: T
  initialState: React.ReducerState<T>
  initializer?: undefined
  key: string
}): [React.ReducerState<T>, React.Dispatch<React.ReducerAction<T>>] => {
  const [state, dispatch] = useReducer(
    reducer,
    getDataFromLocalStorage(key, initialState),
    initializer,
  )

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, dispatch]
}

export default usePersistedReducer
