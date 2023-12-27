'use client'

import { match } from 'ts-pattern'
import dayjs from 'dayjs'
import { BadgeCheckIcon, BadgeXIcon } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { ErrorMessage } from '@/components/ui/error-message'
import { range } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Invites() {
  const receivedInvitationsQuery = trpc.dashboardUser.findReceivedInvitations.useQuery()

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-3xl font-bold">Pending Invitations</h1>

      {match(receivedInvitationsQuery)
        .returnType<React.ReactNode>()
        .with({ status: 'loading' }, () => (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {range(5).map((i) => (
              <Skeleton key={i} className="h-40 w-full bg-muted" />
            ))}
          </div>
        ))
        .with({ status: 'error' }, ({ error }) => (
          <div className="flex h-full w-full items-center justify-center">
            <ErrorMessage title="Something went wrong" description={error?.message ?? ''} />
          </div>
        ))
        .with({ status: 'success' }, ({ data: invitations }) => {
          return (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {invitations.map((invite) => {
                const isExpired = dayjs(invite.expireOn).endOf('day').isBefore(dayjs().startOf('day'))

                return (
                  <Card key={invite.id}>
                    <CardHeader>
                      <CardTitle>{invite.dashboard.name}</CardTitle>
                      {!!invite.dashboard.description && (
                        <CardDescription>{invite.dashboard.description}</CardDescription>
                      )}
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-2">
                        <div className="w-1/3 text-sm text-muted-foreground">Invited By</div>
                        <div className="flex-1 text-sm">{invite.from.email}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-1/3 text-sm text-muted-foreground">Expire On</div>
                        <div className="flex-1 text-sm">
                          {isExpired ? 'Expired' : dayjs(invite.expireOn).format('DD-MMMM-YYYY')}
                        </div>
                      </div>
                    </CardContent>

                    {!isExpired && (
                      <CardFooter className="gap-4">
                        <Button variant="destructive-outline" icon={<BadgeXIcon />}>
                          Reject
                        </Button>
                        <Button icon={<BadgeCheckIcon />}>Reject</Button>
                      </CardFooter>
                    )}
                  </Card>
                )
              })}
            </div>
          )
        })
        .exhaustive()}
    </div>
  )
}
