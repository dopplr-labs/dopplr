'use client'

import { notFound } from 'next/navigation'
import { cloneElement } from 'react'
import { match } from 'ts-pattern'
import { DATABASES } from '@/lib/data/databases'
import { trpc } from '@/lib/trpc/client'
import { Skeleton } from '@/components/ui/skeleton'
import UpdatePGResource from './_components/update-pg-resource'
import DeleteResource from './_components/delete-resource'
import { ErrorMessage } from '@/components/ui/error-message'

export default function ResourceDetailPage({ params: { id } }: { params: { id: string } }) {
  const resourceQuery = trpc.resource.getResource.useQuery({ id: Number.parseInt(id) })

  return (
    <div className="p-6">
      {match(resourceQuery)
        .returnType<React.ReactNode>()
        .with({ status: 'loading' }, () => (
          <div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-14 w-14" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-7/12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))
        .with({ status: 'error' }, ({ error }) => {
          if (error.data?.code === 'NOT_FOUND') {
            notFound()
          }

          return (
            <ErrorMessage
              title="Error fetching resource"
              description={error.message ?? 'Something went wrong. Please try again later.'}
            />
          )
        })
        .with({ status: 'success' }, ({ data: resource }) => {
          const database = DATABASES[resource.type]
          // TODO: Figure out a better way to handle this error
          if (!database) {
            notFound()
          }

          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="inline-block self-start rounded-md border p-3 text-foreground dark:bg-muted">
                  {cloneElement(database.icon, { className: 'w-8 h-8 text-primary' })}
                </div>
                <div>
                  <div className="text-xl font-medium">{resource.name}</div>
                  <div className="text-sm text-muted-foreground">{database.label}</div>
                </div>
              </div>
              {match(resource.type)
                .with('postgres', () => (
                  <UpdatePGResource
                    resource={resource}
                    onUpdate={() => {
                      resourceQuery.refetch()
                    }}
                  />
                ))
                // TODO: Add update support for MySQL
                .with('mysql', () => null)
                .exhaustive()}
              <div className="space-y-4">
                <div className="font-medium text-muted-foreground">Danger Zone</div>
                <DeleteResource resource={resource} />
              </div>
            </div>
          )
        })
        .exhaustive()}
    </div>
  )
}
