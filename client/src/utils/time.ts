import { floor } from 'lodash-es'

export function formatDuration(duration: number) {
  if (duration < 1000) {
    return `${duration} ms`
  }

  const seconds = floor(duration / 1000, 2)
  if (seconds < 60) {
    return `${seconds} s`
  }

  const minutes = floor(seconds / 60, 2)
  return `${minutes} m`
}
