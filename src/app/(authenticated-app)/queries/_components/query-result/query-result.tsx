import { BarChart3, TableIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import QueryTable from './query-table'
import QueryChart from './query-chart'

export default function QueryResult() {
  return (
    <Tabs className="flex h-full flex-col" defaultValue="chart">
      <div className="border-b p-2">
        <TabsList>
          <TabsTrigger value="table">
            <TableIcon className="mr-2 h-4 w-4" />
            <span>Table</span>
          </TabsTrigger>
          <TabsTrigger value="chart">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Chart</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent className="mt-0 flex-1 overflow-y-auto" value="table">
        <QueryTable />
      </TabsContent>
      <TabsContent className="mt-0 flex-1 overflow-y-auto" value="chart">
        <QueryChart />
      </TabsContent>
    </Tabs>
  )
}
