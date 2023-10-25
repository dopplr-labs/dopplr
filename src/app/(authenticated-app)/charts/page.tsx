import { EmptyMessage } from '@/components/ui/empty-message'

export default function Charts() {
  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <EmptyMessage title="No chart selected!" description="Select a chart to view details" />
    </div>
  )
}
