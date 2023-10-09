import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Save } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useStore } from '@/stores'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { useToast } from '@/components/ui/use-toast'
import { TabDataStatus } from '@/types/tab'

type SaveQueryDialogProps = {
  tabId: string
}

const validationSchema = z.object({
  name: z.string(),
})

export default function SaveQueryDialog({ tabId }: SaveQueryDialogProps) {
  const saveQueryVisible = useStore((store) => store.saveQueryVisible)
  const setSaveQueryVisible = useStore((store) => store.setSaveQueryVisible)
  const tabData = useStore((store) => store.queryTabData[tabId])
  const updateQueryTabData = useStore((store) => store.updateQueryTabData)
  const { toast } = useToast()
  const utils = trpc.useContext()

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
    },
  })

  const saveQueryMutation = trpc.history.create.useMutation({
    onError: (error) => {
      toast({
        title: 'Error while saving query',
        description: error.message ?? 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    },
    onSuccess: (savedQuery) => {
      utils.history.getSavedQueriesForUser.invalidate()
      updateQueryTabData(tabId, {
        ...tabData,
        dataStatus: TabDataStatus.SAVED,
        name: savedQuery.name ?? '',
        savedQueryId: savedQuery.id,
        query: savedQuery.query,
      })
      form.reset()
      setSaveQueryVisible(false)

      toast({
        title: `${savedQuery.name} saved successfully!`,
      })
    },
  })

  return (
    <Dialog open={saveQueryVisible} onOpenChange={setSaveQueryVisible}>
      <DialogContent>
        <Form {...form}>
          <form
            className="space-y-2"
            onSubmit={form.handleSubmit(({ name }) => {
              saveQueryMutation.mutate({
                name,
                query: tabData.query,
                resource: tabData.resourceId,
                type: 'SAVED_QUERY',
              })
            })}
          >
            <DialogHeader>
              <DialogTitle>Save Query</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name for your query" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <DialogFooter>
              <Button
                type="submit"
                icon={<Save />}
                loading={saveQueryMutation.isLoading}
                disabled={saveQueryMutation.isLoading}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
