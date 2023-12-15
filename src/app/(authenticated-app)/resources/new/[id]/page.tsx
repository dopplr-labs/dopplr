import { cloneElement } from 'react'
import { notFound } from 'next/navigation'
import { match } from 'ts-pattern'
import { DATABASES } from '@/lib/data/databases'
import CreatePGResource from './_components/create-pg-resource'
import CreateMySQLResource from './_components/create-mysql-resource'

export default function CreateResourcePage({ params: { id } }: { params: { id: string } }) {
  if (!(id in DATABASES)) {
    return notFound()
  }

  const database = DATABASES[id as keyof typeof DATABASES]

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
      {match(id)
        .with('postgres', () => <CreatePGResource />)
        .with('mysql', () => <CreateMySQLResource />)
        .otherwise(() => null)}
    </div>
  )
}
