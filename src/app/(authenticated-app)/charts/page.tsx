'use client'

import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import ChartList from './_components/charts-list'

export default function Charts() {
  return (
    <PanelGroup direction="horizontal" className="h-full overflow-hidden">
      <Panel maxSize={40} minSize={20} defaultSize={25}>
        <ChartList />
      </Panel>
      <PanelResizeHandle className="w-[3px] bg-border/50 transition-colors data-[resize-handle-active]:bg-primary/50" />
      <Panel className="flex flex-col" defaultSize={75}>
        Chart Details
      </Panel>
    </PanelGroup>
  )
}
