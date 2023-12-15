import { Button } from '@/components/ui/button'
import { EmptyMessage } from '@/components/ui/empty-message'
import CreateDashboardDialog from './_components/create-dashboard-dialog'

export default function DashboardPage() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-4">
      <EmptyMessage title="No dashboard selected!" description="Select a dashboard to view its details" />
      <CreateDashboardDialog trigger={<Button>Create Dashboard</Button>} />
    </div>
  )
}
