import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import { DraggableCore } from 'react-draggable'

export type HorizontalPaneProps = {
  className?: string
  children?: React.ReactNode
  initialWidth?: number
  minConstraint?: number
  maxConstraint?: number
  buffer?: number
}

export default function HorizontalPane({
  className,
  children,
  initialWidth = 240,
  minConstraint = 0,
  maxConstraint,
  buffer,
}: HorizontalPaneProps) {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth)
  const [dragDirection, setDragDirection] = useState<string | null>(null)

  const [xPos, setXPos] = useState(initialWidth)

  useEffect(
    function changeBodyCursor() {
      const root = document.getElementById('root')
      if (root) {
        if (xPos < minConstraint && dragDirection === 'left') {
          root.style.cursor = 'w-resize'
        } else if (
          maxConstraint &&
          xPos > maxConstraint &&
          dragDirection === 'left'
        ) {
          root.style.cursor = 'w-resize'
        } else if (xPos < minConstraint && dragDirection === 'right') {
          root.style.cursor = 'e-resize'
        } else if (
          maxConstraint &&
          xPos > maxConstraint &&
          dragDirection === 'right'
        ) {
          root.style.cursor = 'e-resize'
        } else {
          root.style.removeProperty('cursor')
        }
      }
    },
    [xPos, dragDirection, minConstraint, maxConstraint],
  )

  return (
    <div
      className={clsx('relative h-full', className)}
      style={{ width: sidebarWidth }}
    >
      {children}
      <DraggableCore
        onDrag={(e, data) => {
          if (data.deltaX < 0) {
            setDragDirection('left')
          }
          if (data.deltaX > 0) {
            setDragDirection('right')
          }

          if (data.x >= minConstraint) {
            if (maxConstraint) {
              if (data.x <= maxConstraint) {
                setSidebarWidth(data.x)
              }
            } else {
              setSidebarWidth(data.x)
            }
          }

          setXPos(data.x)

          if (buffer) {
            if (data.x < minConstraint - buffer) {
              setSidebarWidth(0)
            }
            if (data.x > minConstraint - buffer + 5 && data.x < minConstraint) {
              setSidebarWidth(minConstraint)
            }
          }
        }}
        onStop={() => {
          setXPos(initialWidth)
          setDragDirection(null)
        }}
      >
        <div
          className="absolute top-0 right-0 w-1 h-full transform translate-x-1/2 bg-background-secondary opacity-0 hover:opacity-75"
          style={{ cursor: 'col-resize' }}
        />
      </DraggableCore>
    </div>
  )
}
