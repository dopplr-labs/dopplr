import clsx from 'clsx'
import React from 'react'

type QueryEditorSkeletonProps = {
  className?: string
  style?: React.CSSProperties
}

export default function QueryEditorSkeleton({
  className,
  style,
}: QueryEditorSkeletonProps) {
  return (
    <div
      className={clsx('flex h-full px-4 space-x-4', className)}
      style={style}
    >
      <div className="flex-1 py-4 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-48 h-10 bg-background-secondary animate-pulse" />
          <div className="flex-1" />
          <div className="w-24 h-10 bg-background-secondary animate-pulse" />
          <div className="w-24 h-10 bg-background-secondary animate-pulse" />
          <div className="w-24 h-10 bg-background-secondary animate-pulse" />
        </div>
        <div className="w-full bg-background-secondary h-80 animate-pulse" />
        <div className="w-full h-40 bg-background-secondary animate-pulse" />
      </div>
    </div>
  )
}
