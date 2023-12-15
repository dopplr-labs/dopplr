'use client'

import { cloneElement, useState } from 'react'
import { PenSquareIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dashboard } from '@/db/schema/dashboards'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/lib/trpc/client'
import { useToast } from '@/components/ui/use-toast'
import { updateDashboardInput } from '@/server/routers/dashboards/input'

type UpdateDashboardDialogProps = {
  className?: string
  style?: React.CSSProperties
  dashboard: Dashboard
  trigger: React.ReactElement
}

type UpdateDashboardInput = Omit<z.infer<typeof updateDashboardInput>, 'id'>

export default function UpdateDashboardDialog({ className, style, dashboard, trigger }: UpdateDashboardDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useContext()

  const form = useForm<UpdateDashboardInput>({
    resolver: zodResolver(updateDashboardInput.omit({ id: true })),
    defaultValues: {
      name: dashboard.name,
      description: dashboard.description ?? undefined,
      icon: dashboard.icon ?? undefined,
      color: dashboard.color ?? undefined,
    },
  })

  const updateDashboardMutation = trpc.dashboards.update.useMutation({
    onError: (error) => {
      toast({ title: 'Something went wrong', description: error?.message ?? 'Please try again!' })
    },
    onSuccess: () => {
      utils.dashboards.findOneWithCharts.invalidate()
      utils.dashboards.findUserDashboard.invalidate()
      setIsDialogOpen(false)

      toast({ title: 'Dashboard updated successfully!' })
    },
  })

  const handleDashboardUpdate = (data: UpdateDashboardInput) => {
    updateDashboardMutation.mutate({ id: dashboard.id, ...data })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{cloneElement(trigger)}</DialogTrigger>

      <DialogContent className={className} style={style}>
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(handleDashboardUpdate)}>
            <DialogHeader>
              <DialogTitle>Create Dashboard</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name for your dashboard" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your dashboard" rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <DialogFooter>
              <Button
                type="submit"
                icon={<PenSquareIcon />}
                loading={updateDashboardMutation.isLoading}
                disabled={updateDashboardMutation.isLoading}
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
