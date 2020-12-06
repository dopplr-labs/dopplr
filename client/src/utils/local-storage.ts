export const getDataFromLocalStorage = <T extends any>(
  key: string,
  initialValue: T,
): T => {
  // check if it browser or not
  if (window && window.localStorage) {
    const data = window.localStorage.getItem(key)
    if (data) {
      try {
        return JSON.parse(data) as T
      } catch (error) {
        return initialValue
      }
    }
  }

  return initialValue
}
