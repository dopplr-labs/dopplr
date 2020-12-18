import React from 'react'
import Scrollbars from 'react-custom-scrollbars'

type PageLayoutProps = {
  sidebar: React.ReactElement
  content: React.ReactElement
}

export default function PageLayout({ sidebar, content }: PageLayoutProps) {
  return (
    <div className="flex h-full space-x-8 bg-white">
      <div className="h-full border-r w-80">{sidebar}</div>
      <Scrollbars className="flex-1 h-full" autoHide>
        <div className="py-8 pr-8">{content}</div>
      </Scrollbars>
    </div>
  )
}
