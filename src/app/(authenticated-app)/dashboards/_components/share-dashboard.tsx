'use client'

import { SendIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createInvitationInput } from '@/server/routers/dashboard-user/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/client'

type ShareDashboardProps = {
  className?: string
  style?: React.CSSProperties
  open?: boolean
  onOpenChange?: (open: boolean) => void
  dashboardId: number
}

export default function ShareDashboard({ className, style, open, onOpenChange, dashboardId }: ShareDashboardProps) {
  const { toast } = useToast()

  const invitationMutation = trpc.dashboardUser.createInvitation.useMutation({
    onSuccess: () => {
      form.reset({ to: '' })
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
                            <SelectItem value="VIEWER">can view</SelectItem>
                            <SelectItem value="EDITOR">can edit</SelectItem>
                            <SelectItem value="OWNER">owner</SelectItem>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
