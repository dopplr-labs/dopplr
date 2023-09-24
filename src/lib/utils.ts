import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function range(start: number, end?: number, step: number = 1) {
  if (end === undefined) {
    end = start
    start = 0
  }
  const length = Math.max(Math.ceil((end - start) / step), 0)
  return Array.from({ length }, (_, index) => start + index * step)
}

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice()
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0])
  return newArray
}

export function arraySwap<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice()
  newArray[from] = array[to]
  newArray[to] = array[from]
  return newArray
}

export function arrayInsert<T>(array: T[], item: T, index: number): T[] {
  const newArray = array.slice()
  newArray.splice(index, 0, item)
  return newArray
}

export function arrayRemove<T>(array: T[], index: number): T[] {
  const newArray = array.slice()
  newArray.splice(index, 1)
  return newArray
}

export function groupBy<T>(array: T[], getKey: (item: T) => string): Record<string, T[]> {
  const result: Record<string, T[]> = {}

  array.forEach((item) => {
    const key = getKey(item)
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(item)
  })

  return result
}

export function getNextActiveId(idsList: string[], activeId: string) {
  const currentIndex = idsList.indexOf(activeId)
  // If the tabId is not found in the array
  if (currentIndex === -1) {
    return undefined
  }
  // If the current active ID is not the last one
  if (currentIndex < idsList.length - 1) {
    return idsList[currentIndex + 1]
  }
  // If the current active ID is the last one, but it's not the only ID in the array
  if (currentIndex > 0) {
    return idsList[currentIndex - 1]
  }
  // If there's only one ID in the array (which is the active one)
  return undefined
}

export function generateRandomId(length: number = 8): string {
  const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id: string = ''
  for (let i = 0; i < length; i++) {
    const randomIndex: number = Math.floor(Math.random() * chars.length)
    id += chars.charAt(randomIndex)
  }
  return id
}
