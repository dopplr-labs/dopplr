import React, { useState, useEffect, useCallback } from 'react'
import { DraggableCore } from 'react-draggable'
import usePersistedSetState from 'hooks/use-persisted-state'

type HorizontalPaneProps = {
  render: (props: {
    paneWidth: number
    isPaneClose?: boolean
    dragHandle: React.ReactNode
    toggleFullScreen?: () => void
  }) => React.ReactElement
  paneName: string
  initialWidth?: number
  minConstraint?: number
  maxConstraint?: number
  buffer?: number
}

const BUFFER_MARGIN = 5

export default function HorizontalPane({
  render,
  paneName,
  initialWidth = 240,
  minConstraint = 0,
  maxConstraint,
  buffer,
}: HorizontalPaneProps) {
  const [paneWidth, setPaneWidth] = usePersistedSetState<number>(
    paneName,
    initialWidth,
  )
  const [dragDirection, setDragDirection] = useState<string | null>(null)

  const isPaneClose = paneWidth === 0
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

  const toggleFullScreen = useCallback(() => {
    setPaneWidth((prevState) => (prevState === 0 ? initialWidth : 0))
  }, [initialWidth, setPaneWidth])

  const dragHandle = (
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
              setPaneWidth(data.x)
            }
          } else {
            setPaneWidth(data.x)
          }
        }

        setXPos(data.x)

        if (buffer) {
          if (data.x < minConstraint - buffer) {
            setPaneWidth(0)
          }
          if (
            data.x > minConstraint - buffer + BUFFER_MARGIN &&
            data.x < minConstraint
          ) {
            setPaneWidth(minConstraint)
          }
        }
      }}
      onStop={() => {
        setXPos(initialWidth)
        setDragDirection(null)
      }}
    >
      <div
        className="absolute top-0 right-0 w-1 h-full transform translate-x-1/2 bg-gray-200 opacity-0 hover:opacity-75"
        style={{ cursor: 'col-resize' }}
      />
    </DraggableCore>
  )

  return render({ paneWidth, isPaneClose, dragHandle, toggleFullScreen })
}
