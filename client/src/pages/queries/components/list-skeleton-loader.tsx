import React from 'react'
import { range } from 'lodash-es'
import clsx from 'clsx'

type ListSkeletonLoaderProps = {
  className?: string
  style?: React.CSSProperties
}

export default function ListSkeletonLoader({
  className,
  style,
}: ListSkeletonLoaderProps) {
  return (
    <div className={clsx('px-3 space-y-4', className)} style={style}>
      <div className="w-full h-8 mb-2 rounded bg-background-secondary animate-pulse" />
      {range(10).map((val) => (
        <div
          key={val}
          className="w-full h-4 bg-background-secondary animate-pulse"
          style={{ opacity: 1 - val / 10 }}
        />
      ))}
    </div>
  )
}
