'use client'

import { DatabaseZapIcon, FileClockIcon, SaveAllIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SchemaTab from './schema-tab/schema-tab'
import HistoryTab from './history-tab/history-tab'
import SavedQueriesTab from './saved-queries-tab/saved-queries-tab'
import { cn } from '@/lib/utils'

type SidePanelProps = {
  className?: string
  style?: React.CSSProperties
}

export default function SidePanel({ className, style }: SidePanelProps) {
  return (
    <Tabs className={cn('flex h-full flex-col', className)} style={style} defaultValue="schema">
      <div className="border-b p-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger className="truncate" value="schema">
            <DatabaseZapIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Schema</span>
          </TabsTrigger>
          <TabsTrigger className="truncate" value="history">
            <FileClockIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">History</span>
          </TabsTrigger>
          <TabsTrigger className="truncate" value="saved-queries">
            <SaveAllIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Saved Queries</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent className="mt-0 flex-1 overflow-hidden" value="schema">
        <SchemaTab />
      </TabsContent>
      <TabsContent className="mt-0 flex-1 overflow-hidden" value="history">
        <HistoryTab />
      </TabsContent>
      <TabsContent className="mt-0 flex-1 overflow-hidden" value="saved-queries">
        <SavedQueriesTab />
      </TabsContent>
    </Tabs>
  )
}
