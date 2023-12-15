'use client'

import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { EmptyMessage } from '@/components/ui/empty-message'

export default function Charts() {
  const router = useRouter()

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-4">
      <EmptyMessage title="No chart selected!" description="Select a chart to view details" />
      <Button
        icon={<PlusIcon />}
        onClick={() => {
          router.push('/queries')
        }}
      >
        Create Chart
      </Button>
    </div>
  )
}
