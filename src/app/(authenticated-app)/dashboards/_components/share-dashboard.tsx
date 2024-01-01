'use client'

import { SendIcon, XIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { match } from 'ts-pattern'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createInvitationInput } from '@/server/routers/dashboard-user/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/client'
import { ErrorMessage } from '@/components/ui/error-message'
import { ROLE_LABEL_MAP } from '@/lib/dashboards/dashboard-user'
import { EmptyMessage } from '@/components/ui/empty-message'

type ShareDashboardProps = {
  className?: string
  style?: React.CSSProperties
  open?: boolean
  onOpenChange?: (open: boolean) => void
  dashboardId: number
}

export default function ShareDashboard({ className, style, open, onOpenChange, dashboardId }: ShareDashboardProps) {
  const { toast } = useToast()

  const sentInvitationsQuery = trpc.dashboardUser.findSentInvitations.useQuery({ dashboard: dashboardId })

  const invitationMutation = trpc.dashboardUser.createInvitation.useMutation({
    onSuccess: () => {
      sentInvitationsQuery.refetch()
      form.reset({ to: '', dashboard: dashboardId })
      toast({
        title: 'Success!',
        description: 'Invitation sent to user successfully!',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Something went wrong!',
        description: error?.message ?? '',
        variant: 'destructive',
      })
    },
  })

  const deleteInviteMutation = trpc.dashboardUser.deleteInvitation.useMutation({
    onSuccess: () => {
      sentInvitationsQuery.refetch()
      toast({
        title: 'Success!',
        description: 'Invitation deleted successfully!',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Something went wrong!',
        description: error?.message ?? '',
        variant: 'destructive',
      })
    },
  })

  const form = useForm<z.infer<typeof createInvitationInput>>({
    resolver: zodResolver(createInvitationInput),
    defaultValues: {
      dashboard: dashboardId,
      role: 'VIEWER',
      status: 'NOT_CONFIRMED',
    },
  })

  const handleInvitation = (values: z.infer<typeof createInvitationInput>) => {
    invitationMutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className} style={style}>
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Form {...form}>
            <form className="flex items-center gap-2" onSubmit={form.handleSubmit(handleInvitation)}>
              <div className="flex w-full items-center gap-2 rounded-md border">
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <input
                          className="border-none bg-transparent px-4 py-1.5 text-sm focus-visible:outline-none"
                          placeholder="Enter user's email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="px-4 pb-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-40">
                      <FormControl>
                        <Select defaultValue="VIEWER" {...field} value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className=" border-none focus:ring-0">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ROLE_LABEL_MAP).map(([role, label]) => (
                              <SelectItem key={role} value={role}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button icon={<SendIcon />} type="submit" />
            </form>
          </Form>

          {match(sentInvitationsQuery)
            .returnType<React.ReactNode>()
            .with({ status: 'loading' }, () => <div>Loading</div>)
            .with({ status: 'error' }, ({ error }) => (
              <div className="flex items-center justify-center">
                <ErrorMessage title="Something went wrong" description={error?.message ?? ''} />
              </div>
            ))
            .with({ status: 'success' }, ({ data: invitations }) => {
              const pendingInvitations = invitations.filter((invite) => invite.status === 'NOT_CONFIRMED')
              const acceptedInvitations = invitations.filter((invite) => invite.status === 'CONFIRMED')

              if (invitations.length === 0) {
                return (
                  <EmptyMessage title="No invitations yet" description="Start by sending and invitation to a user" />
                )
              }

              return (
                <div className="space-y-4">
                  {acceptedInvitations.length === 0 ? (
                    <EmptyMessage
                      title="No accepted invitations"
                      description="No-one has accepted your invitations yet."
                    />
                  ) : (
                    <div className="space-y-2">
                      <h1>Accepted Invitations</h1>
                      <div className="flex flex-col gap-1">
                        {acceptedInvitations.map((invite) => (
                          <div
                            className="flex items-center justify-between rounded-md border px-4 py-2"
                            key={invite.id}
                          >
                            <div className="text-sm">{invite?.to?.email}</div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-muted-foreground">{ROLE_LABEL_MAP[invite.role]}</div>
                              <Button
                                icon={<XIcon />}
                                size="icon-sm"
                                loading={deleteInviteMutation.isLoading}
                                variant="ghost"
                                onClick={() => {
                                  deleteInviteMutation.mutate({ id: invite.id })
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pendingInvitations.length === 0 ? (
                    <EmptyMessage title="No pending invitations" description="You have not invited anyone yet." />
                  ) : (
                    <div className="space-y-2">
                      <h1>Pending Invitations</h1>
                      <div className="flex flex-col gap-1">
                        {pendingInvitations.map((invite) => (
                          <div
                            className="flex items-center justify-between rounded-md border px-4 py-2"
                            key={invite.id}
                          >
                            <div className="text-sm">{invite?.to?.email}</div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-muted-foreground">{ROLE_LABEL_MAP[invite.role]}</div>
                              <Button
                                icon={<XIcon />}
                                size="icon-sm"
                                loading={deleteInviteMutation.isLoading}
                                variant="ghost"
                                onClick={() => {
                                  deleteInviteMutation.mutate({ id: invite.id })
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
            .exhaustive()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
