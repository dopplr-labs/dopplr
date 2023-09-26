'use client'

import { DatabaseZapIcon, FileClockIcon, SaveAllIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SchemaTab from './schema-tab/schema-tab'

type SidePanelProps = {
  className?: string
  style?: React.CSSProperties
}

export default function SidePanel({ className, style }: SidePanelProps) {
  return (
    <Tabs className={className} style={style} value="schema">
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

      <TabsContent value="schema">
        <SchemaTab />
      </TabsContent>
    </Tabs>
  )
}
