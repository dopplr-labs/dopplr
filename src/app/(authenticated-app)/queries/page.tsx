'use client'

import { Code2Icon, TerminalIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { Skeleton } from '@/components/ui/skeleton'
import PgEditor from '@/components/pg-editor'

export default function QueriesPage() {
  const getResourceQuery = trpc.resource.getResource.useQuery({ id: 1 })

  const content = useMemo(() => {
    if (getResourceQuery.isLoading) {
      return <Skeleton className="h-full rounded-none" />
    }

    if (getResourceQuery.data) {
      return (
        <div className="flex h-full flex-col">
          <div className="flex-1">
            <PgEditor resource={getResourceQuery.data} />
          </div>
          <div className="h-[240px] border-t" />
        </div>
      )
    }

    return null
  }, [getResourceQuery])

  return (
    <div className="flex h-full">
      <div className="w-[240px] border-r" />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-end space-x-4 px-4 py-2">
          <Button icon={<Code2Icon />} variant="ghost">
            Format
          </Button>
          <Button icon={<TerminalIcon />} variant="outline">
            Run Query
          </Button>
        </div>
        <div className="flex-1">{content}</div>
      </div>
    </div>
  )
}
