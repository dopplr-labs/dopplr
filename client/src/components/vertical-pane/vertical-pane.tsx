import React, { useCallback, useEffect, useState } from 'react'
import { DraggableCore } from 'react-draggable'

type VerticalPaneProps = {
  render: (props: {
    paneHeight: number
    dragHandle: React.ReactNode
    isFullScreen: boolean
    toggleFullScreen: () => void
  }) => React.ReactElement
  initialHeight: number
  buffer: number
  maxHeight: number
  maxConstraint: number
  minConstraint?: number
}

export default function VerticalPane({
  render,
  initialHeight,
  buffer,
  maxHeight,
  maxConstraint,
  minConstraint = 200,
}: VerticalPaneProps) {
  const [paneHeight, setPaneHeight] = useState(initialHeight)

  const isFullScreen = paneHeight === maxHeight

  const [shouldChangeCursor, setShouldChangeCursor] = useState(false)

  useEffect(
    function changeBodyCursor() {
      const root = document.getElementById('root')
      if (!root) {
        return
      }
      if (shouldChangeCursor) {
        root.style.cursor = 'n-resize'
      } else {
        root.style.removeProperty('cursor')
      }
    },
    [shouldChangeCursor],
  )

  const toggleFullScreen = useCallback(() => {
    setPaneHeight((prevState) =>
      prevState === maxHeight ? initialHeight : maxHeight,
    )
  }, [initialHeight, maxHeight])

  const dragHandle = (
    <DraggableCore
      onDrag={(e, data) => {
        if (paneHeight - data.y >= minConstraint) {
          if (paneHeight - data.y <= maxConstraint) {
            setPaneHeight((prevState) => prevState - data.y)
          }
        }

        if (paneHeight - data.y >= maxConstraint + buffer && !isFullScreen) {
          setPaneHeight(maxHeight)
        }

        if (
          paneHeight - data.y < maxConstraint + buffer - 8 &&
          paneHeight - data.y > maxConstraint
        ) {
          setPaneHeight(maxConstraint)
          setShouldChangeCursor(true)
        }
      }}
      onStop={() => {
        setShouldChangeCursor(false)
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1 transform -translate-y-1/2 bg-gray-200 opacity-0 hover:opacity-75"
        style={{ cursor: 'row-resize' }}
      />
    </DraggableCore>
  )

  return render({ paneHeight, isFullScreen, dragHandle, toggleFullScreen })
}
