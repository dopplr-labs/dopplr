import React from 'react'
import Scrollbars from 'react-custom-scrollbars'

type PageSideBarProps = {
  title?: string
  description?: string
  primaryAction?: React.ReactElement
  items?: React.ReactNode
}

export default function PageSideBar({
  title,
  description,
  primaryAction,
  items,
}: PageSideBarProps) {
  return (
    <div className="flex flex-col h-full">
      {title || description || primaryAction ? (
        <div className="p-4 mb-2 border-b">
          <div className="text-base font-medium text-content-primary">
            {title}
          </div>
          <div className="text-xs">{description}</div>
          {primaryAction ? <div className="mt-4">{primaryAction}</div> : null}
        </div>
      ) : null}
      <Scrollbars className="flex-1">
        <div className="py-2 space-y-2">{items}</div>
      </Scrollbars>
    </div>
  )
}
