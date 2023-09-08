'use client'

import { DatabaseZapIcon } from 'lucide-react'
import { cloneElement, useMemo } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc/client'
import { range } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { simpleHash } from '@/lib/random/utils'
import { DATABASES } from '@/lib/data/databases'

type ResourceAppShellProps = {
  children: React.ReactNode
}

export default function ResourceAppShell({ children }: ResourceAppShellProps) {
  const getResourcesQuery = trpc.resource.getResources.useQuery()

  const content = useMemo(() => {
    if (getResourcesQuery.isLoading) {
      return (
        <div className="space-y-4">
          {range(5).map((key) => {
            return (
              <div className="flex items-center space-x-2" key={key}>
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-7" style={{ width: `${simpleHash(key)}%` }} />
              </div>
            )
          })}
        </div>
      )
    }

    if (getResourcesQuery.data) {
      if (getResourcesQuery.data?.length === 0) {
        return (
          <div className="h-full">
            <DatabaseZapIcon className="h-10 w-10 flex-shrink-0 text-muted-foreground" />
            <div className="text-center text-xs text-muted-foreground">
              You have not added any resource. Get started by adding a resource
            </div>
          </div>
        )
      }

      return (
        <div className="space-y-4">
          {getResourcesQuery.data.map((resource) => {
            const resourceIcon = DATABASES.find((database) => database.id === resource.type)?.miniIcon
            return (
              <Link
                className="flex items-center space-x-2 truncate"
                key={resource.id}
                href={`/resources/${resource.id}`}
              >
                {resourceIcon ? (
                  <div className="rounded-md bg-muted p-1">
                    {cloneElement(resourceIcon, { className: 'w-5 h-5 text-primary' })}
                  </div>
                ) : null}
                <div className="flex-1 truncate text-sm">{resource.name}</div>
              </Link>
            )
          })}
        </div>
      )
    }

    return null
  }, [getResourcesQuery])

  return (
    <div className="flex h-full">
      <div className="w-[280px] overflow-auto border-r p-4">{content}</div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
