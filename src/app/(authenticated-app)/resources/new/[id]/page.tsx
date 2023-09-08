import { cloneElement, useMemo } from 'react'
import { notFound } from 'next/navigation'
import { DATABASES } from '@/lib/data/databases'
import CreatePGResource from './_components/create-pg-resource'

export default function CreateResourcePage({ params: { id } }: { params: { id: string } }) {
  const database = useMemo(() => DATABASES.find((db) => db.id === id), [id])

  if (!database) {
    return notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="inline-block self-start rounded-md border p-3 text-foreground dark:bg-muted">
          {cloneElement(database.icon, { className: 'w-8 h-8 text-primary' })}
        </div>
        <div>
          <div className="text-xl font-medium">{database.label}</div>
          <div className="text-sm text-muted-foreground">{database.description}</div>
        </div>
      </div>
      {(() => {
        switch (database.id) {
          case 'postgres': {
            return <CreatePGResource />
          }

          default: {
            return null
          }
        }
      })()}
    </div>
  )
}
