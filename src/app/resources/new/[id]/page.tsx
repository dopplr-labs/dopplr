import { cloneElement, useMemo } from 'react'
import { notFound } from 'next/navigation'
import { RouterIcon } from 'lucide-react'
import Link from 'next/link'
import { DATBASES } from '@/lib/data/databases'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BaseButton, Button } from '@/components/ui/button'

export default function CreateResourcePage({ params: { id } }: { params: { id: string } }) {
  const database = useMemo(() => DATBASES.find((db) => db.id === id), [id])

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
      <Card className="max-w-screen-lg">
        <CardHeader>
          <CardTitle>Create Resource</CardTitle>
          <CardDescription>Enter database credentials</CardDescription>
        </CardHeader>
        <CardFooter className="gap-4">
          <Button variant="outline" icon={<RouterIcon />}>
            Test Connection
          </Button>
          <div className="flex-1" />
          <BaseButton variant="secondary" asChild>
            <Link href="/resources">Cancel</Link>
          </BaseButton>
          <Button>Create</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
