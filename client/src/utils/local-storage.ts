export const getDataFromLocalStorage = <T extends any>(
  key: string,
  initialValue: T,
): T => {
  // check if it browser or not
  if (window && window.localStorage) {
    const data = window.localStorage.getItem(key)
    if (data) {
      return JSON.parse(data) as T
    }
    return initialValue
  }

  return initialValue
}
