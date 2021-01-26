import usePersistedSetState from 'hooks/use-persisted-state'
import React, { useCallback, useEffect, useState } from 'react'
import { DraggableCore } from 'react-draggable'

export type VerticalPaneProps = {
  render: (props: {
    paneHeight: number
    dragHandle: React.ReactNode
    isFullScreen: boolean
    toggleFullScreen: () => void
  }) => React.ReactElement
  paneName: string
  initialHeight: number
  buffer: number
  maxHeight: number
  maxConstraint: number
  minConstraint?: number
}

const BUFFER_MARGIN = 8

export default function VerticalPane({
  render,
  paneName,
  initialHeight,
  buffer,
  maxHeight,
  maxConstraint,
  minConstraint = 200,
}: VerticalPaneProps) {
  const [paneHeight, setPaneHeight] = usePersistedSetState<number>(
    paneName,
    initialHeight,
  )

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
  }, [initialHeight, setPaneHeight, maxHeight])

  const dragHandle = (
    <DraggableCore
      onDrag={(e, data) => {
        if (
          paneHeight - data.y >= minConstraint &&
          paneHeight - data.y <= maxConstraint
        ) {
          setPaneHeight((prevState) => prevState - data.y)
        }

        if (paneHeight - data.y >= maxConstraint + buffer && !isFullScreen) {
          setPaneHeight(maxHeight)
        }

        if (
          paneHeight - data.y < maxConstraint + buffer - BUFFER_MARGIN &&
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
        className="absolute top-0 left-0 w-full h-1 transform -translate-y-1/2 opacity-0 bg-background-secondary hover:opacity-75"
        style={{ cursor: 'row-resize' }}
      />
    </DraggableCore>
  )

  return render({ paneHeight, isFullScreen, dragHandle, toggleFullScreen })
}
