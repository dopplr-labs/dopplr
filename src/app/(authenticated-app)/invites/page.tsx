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
import { useToast } from '@/components/ui/use-toast'
import { EmptyMessage } from '@/components/ui/empty-message'

export default function Invites() {
  const { toast } = useToast()
  const receivedInvitationsQuery = trpc.dashboardUser.findReceivedInvitations.useQuery()

  const acceptOrRejectMutation = trpc.dashboardUser.acceptOrRejectInvite.useMutation({
    onError: (error) => {
      toast({ title: 'Something went wrong', description: error?.message ?? '', variant: 'destructive' })
    },
    onSuccess: (_, variables) => {
      toast({
        title: 'Success',
        description: `Application ${variables.status === 'ACCEPT' ? 'accepted' : 'rejected'} successfully!`,
        variant: 'success',
      })

      receivedInvitationsQuery.refetch()
    },
  })

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
          if (invitations.length === 0) {
            return (
              <div className="flex items-center justify-center">
                <EmptyMessage title="No invitations" description="No-one has invited you yet." />
              </div>
            )
          }

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
                        <Button
                          loading={acceptOrRejectMutation.isLoading}
                          variant="destructive-outline"
                          icon={<BadgeXIcon />}
                          onClick={() => {
                            acceptOrRejectMutation.mutate({ id: invite.id, status: 'REJECT' })
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          loading={acceptOrRejectMutation.isLoading}
                          icon={<BadgeCheckIcon />}
                          onClick={() => {
                            acceptOrRejectMutation.mutate({ id: invite.id, status: 'ACCEPT' })
                          }}
                        >
                          Accept
                        </Button>
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
