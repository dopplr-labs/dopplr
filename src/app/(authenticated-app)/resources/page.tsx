import { ZapIcon } from 'lucide-react'
import { cloneElement } from 'react'
import Link from 'next/link'
import { BaseButton } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { DATBASES } from '@/lib/data/databases'

export default function Page() {
  return (
    <div className="p-6">
      <div className="text-xl font-medium">Add New Resource</div>
      <div className="mb-6 text-sm text-muted-foreground">
        Connect to a database and start crafting queries for your dashboard.
      </div>
      <div className="grid grid-cols-2 gap-6 xl:grid-cols-3">
        {DATBASES.map((database) => {
          return (
            <Card
              className={cn(
                'flex flex-col',
                database.disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : undefined,
              )}
              key={database.id}
            >
              <CardHeader className="flex-1">
                <div className="mb-4 inline-block self-start rounded-md border p-3 text-foreground dark:bg-muted">
                  {cloneElement(database.icon, { className: 'w-8 h-8 text-primary' })}
                </div>
                <CardTitle>{database.label}</CardTitle>
                <CardDescription>{database.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <BaseButton className="w-full" variant="outline" asChild>
                  <Link href={`/resources/new/${database.id}`}>
                    <ZapIcon className="mr-2 h-4 w-4" />
                    Connect Resource
                  </Link>
                </BaseButton>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
