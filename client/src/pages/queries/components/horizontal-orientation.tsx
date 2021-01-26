import React from 'react'
import { Tooltip } from 'antd'
import { RectReadOnly } from 'react-use-measure'
import {
  BorderVerticleOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import VerticalPane from 'components/vertical-pane'

type HorizontalOrientationProps = {
  toggleOrientation: () => void
  containerBounds: RectReadOnly
  editor: React.ReactElement
  tabContent: (headerIcons: React.ReactElement) => React.ReactElement
}

export default function HorizontalOrientation({
  toggleOrientation,
  containerBounds,
  editor,
  tabContent,
}: HorizontalOrientationProps) {
  return (
    <VerticalPane
      paneName="editor-vertical-pane"
      initialHeight={480}
      maxHeight={containerBounds.height}
      maxConstraint={containerBounds.height - 160}
      buffer={80}
      render={({ paneHeight, isFullScreen, dragHandle, toggleFullScreen }) => {
        const headerIcons = (
          <div className="space-x-4">
            <Tooltip
              placement="left"
              title="Split Vertically"
              mouseEnterDelay={1}
            >
              <button
                className="focus:outline-none"
                onClick={toggleOrientation}
              >
                <BorderVerticleOutlined />
              </button>
            </Tooltip>
            <Tooltip placement="left" title="Fullscreen" mouseEnterDelay={1}>
              <button className="focus:outline-none" onClick={toggleFullScreen}>
                {isFullScreen ? <DownOutlined /> : <UpOutlined />}
              </button>
            </Tooltip>
          </div>
        )

        return (
          <>
            {!isFullScreen ? (
              <div
                className="w-full"
                style={{ height: containerBounds.height - paneHeight }}
              >
                {editor}
              </div>
            ) : null}
            <div className="relative border-t" style={{ height: paneHeight }}>
              {dragHandle}
              {tabContent(headerIcons)}
            </div>
          </>
        )
      }}
    />
  )
}
