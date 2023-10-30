'use client'

import { cloneElement, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { createDashboardInput } from '@/server/routers/dashboards/input'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/lib/trpc/client'
import { useToast } from '@/components/ui/use-toast'

type CreateDashboardDialogProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement
}

export default function CreateDashboardDialog({ className, style, trigger }: CreateDashboardDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useContext()

  const form = useForm<z.infer<typeof createDashboardInput>>({
    resolver: zodResolver(createDashboardInput),
  })

  const createDashboardMutation = trpc.dashboards.create.useMutation({
    onError: (error) => {
      toast({
        title: 'Error while saving query',
        description: error.message ?? 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      utils.dashboards.findUserDashboard.invalidate()
      form.reset()
      setIsDialogOpen(false)

      toast({ title: 'Dashboard created successfully!' })
    },
  })

  const handleDashboardCreate = (data: z.infer<typeof createDashboardInput>) => {
    createDashboardMutation.mutate(data)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{cloneElement(trigger)}</DialogTrigger>

      <DialogContent className={className} style={style}>
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(handleDashboardCreate)}>
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
                icon={<PlusIcon />}
                loading={createDashboardMutation.isLoading}
                disabled={createDashboardMutation.isLoading}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
