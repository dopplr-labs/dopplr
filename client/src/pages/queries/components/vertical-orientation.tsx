import React from 'react'
import { Tooltip } from 'antd'
import { RectReadOnly } from 'react-use-measure'
import {
  BorderHorizontalOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons'
import HorizontalPane from 'components/horizontal-pane'

type VerticalOrientationProps = {
  toggleOrientation: () => void
  containerBounds: RectReadOnly
  editor: React.ReactElement
  tabContent: (headerIcons: React.ReactElement) => React.ReactElement
}

export default function VerticalOrientation({
  toggleOrientation,
  editor,
  containerBounds,
  tabContent,
}: VerticalOrientationProps) {
  const { pathname } = useLocation()
  const isSaved = pathname.split('/')[2] === 'saved'
  const queryId = pathname.split('/')[3]
  return (
    <HorizontalPane
      paneName="editor-horizontal-pane"
      initialWidth={640}
      maxConstraint={800}
      minConstraint={320}
      buffer={160}
      render={({ paneWidth, isPaneClose, dragHandle, toggleFullScreen }) => {
        const headerIcons = (
          <div className="space-x-4">
            <Tooltip
              title="Split Horizontally"
              placement="left"
              mouseEnterDelay={1}
            >
              <button
                className="focus:outline-none"
                onClick={toggleOrientation}
              >
                <BorderHorizontalOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Fullscreen" placement="left" mouseEnterDelay={1}>
              <button className="focus:outline-none" onClick={toggleFullScreen}>
                {isPaneClose ? <RightOutlined /> : <LeftOutlined />}
              </button>
            </Tooltip>
          </div>
        )

        return (
          <>
            <div
              className="relative z-10 flex flex-col h-full border-r"
              style={{ width: paneWidth }}
            >
              {editor}
              {dragHandle}
            </div>
            <div
              className="h-full"
              style={{ width: containerBounds.width - paneWidth }}
            >
              {tabContent(headerIcons)}
            </div>
          </>
        )
      }}
    />
  )
}
