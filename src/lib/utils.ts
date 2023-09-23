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
