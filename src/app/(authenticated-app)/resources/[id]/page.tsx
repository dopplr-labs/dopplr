import { notFound } from 'next/navigation'
import { cloneElement } from 'react'
import { api } from '@/lib/trpc/api'
import { DATABASES } from '@/lib/data/databases'

export default async function ResourceDetailPage({ params: { id } }: { params: { id: string } }) {
  const resource = await api.resource.getResource.query({ id: Number.parseInt(id) })
  if (!resource) {
    notFound()
  }

  const database = DATABASES.find((database) => database.id === resource.type)
  // TODO: Figure out a better way to handle this error
  if (!database) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="inline-block self-start rounded-md border p-3 text-foreground dark:bg-muted">
          {cloneElement(database.icon, { className: 'w-8 h-8 text-primary' })}
        </div>
        <div>
          <div className="text-xl font-medium">{resource.name}</div>
          <div className="text-sm text-muted-foreground">{database.label}</div>
        </div>
      </div>
    </div>
  )
}
