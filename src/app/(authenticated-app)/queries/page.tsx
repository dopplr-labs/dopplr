'use client'

import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import SidePanel from './_components/side-panel'
import QueryTabs from './_components/query-tabs'
import QueryEditor from './_components/query-editor'

export default function QueriesPage() {
  return (
    <PanelGroup direction="horizontal" className="h-full overflow-hidden">
      <Panel maxSize={40} minSize={20} defaultSize={25}>
        <SidePanel />
      </Panel>
      <PanelResizeHandle className="w-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
      <Panel className="flex flex-col" defaultSize={75}>
        <QueryTabs className="border-b" />
        <QueryEditor resourceId={3} tempId="foo" />
      </Panel>
    </PanelGroup>
  )
}
