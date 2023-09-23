'use client'

import { DatabaseZapIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { match } from 'ts-pattern'
import { trpc } from '@/lib/trpc/client'
import { range } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { simpleHash } from '@/lib/random/utils'
import { DATABASES } from '@/lib/data/databases'
import NavLink from './nav-link'
import { BaseButton } from '@/components/ui/button'

type ResourceAppShellProps = {
  children: React.ReactNode
}

export default function ResourceAppShell({ children }: ResourceAppShellProps) {
  const getResourcesQuery = trpc.resource.getResources.useQuery()

  const pathname = usePathname()

  return (
    <div className="flex h-full">
      <div className="w-[280px] overflow-auto border-r p-3">
        {match(getResourcesQuery)
          .returnType<React.ReactNode>()
          .with({ status: 'loading' }, () => (
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
          ))
          // TODO: Add error handler
          .with({ status: 'error' }, () => null)
          .with({ status: 'success' }, ({ data }) => {
            if (data.length === 0) {
              return (
                <div className="flex h-full flex-col items-center justify-center">
                  <DatabaseZapIcon className="h-10 w-10 flex-shrink-0" />
                  <div className="text-center text-xs text-muted-foreground">
                    You have not added any resource. Get started by adding a resource
                  </div>
                </div>
              )
            }

            return (
              <div className="flex h-full flex-col space-y-3">
                <div className="flex-1 space-y-3 overflow-auto">
                  {data.map((resource) => {
                    const resourceIcon = DATABASES[resource.type]?.icon
                    return (
                      <NavLink
                        key={resource.id}
                        href={`/resources/${resource.id}`}
                        icon={resourceIcon}
                        label={resource.name}
                      />
                    )
                  })}
                </div>
                {pathname !== '/resources' ? (
                  <BaseButton variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/resources">Create Resource</Link>
                  </BaseButton>
                ) : null}
              </div>
            )
          })
          .exhaustive()}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
