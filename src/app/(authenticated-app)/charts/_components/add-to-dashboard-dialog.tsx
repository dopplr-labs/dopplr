import { PinIcon } from 'lucide-react'
import { cloneElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/client'
import { addOrRemoveFromDashboardInput } from '@/server/routers/charts/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type AddToDashboardDialogProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement
  chartId: number
}

export default function AddToDashboardDialog({ className, style, trigger, chartId }: AddToDashboardDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useContext()

  const { data: dashboards } = trpc.dashboards.findUserDashboard.useQuery()
  const addToDashboardMutation = trpc.charts.addToDashboard.useMutation({
    onSuccess: () => {
      setIsDialogOpen(false)

      utils.dashboards.findUserDashboard.invalidate()
      toast({ title: 'Chart added to dashboard successfully!' })
    },
    onError: (error) => {
      toast({ title: 'Error', description: error?.message ?? 'Something went wrong!', variant: 'destructive' })
    },
  })

  const form = useForm<z.infer<typeof addOrRemoveFromDashboardInput>>({
    resolver: zodResolver(addOrRemoveFromDashboardInput),
    defaultValues: {
      chartId,
    },
  })

  const handleAddToDashboard = (values: z.infer<typeof addOrRemoveFromDashboardInput>) => {
    addToDashboardMutation.mutate(values)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{cloneElement(trigger)}</DialogTrigger>

      <DialogContent className={className} style={style}>
        <DialogHeader>
          <DialogTitle>Add To Dashboard</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(handleAddToDashboard)}>
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Dashboard Name</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange} value={field.value?.toString()}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select dashboard" />
                        </SelectTrigger>

                        <SelectContent>
                          {dashboards?.map((dashboard) => (
                            <SelectItem key={dashboard.id} value={dashboard?.id?.toString() ?? ''}>
                              {dashboard.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <DialogFooter>
              <Button
                type="submit"
                icon={<PinIcon />}
                loading={addToDashboardMutation.isLoading}
                disabled={addToDashboardMutation.isLoading}
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
