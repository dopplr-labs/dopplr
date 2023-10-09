import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Save } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useStore } from '@/stores'
import { createHistoryInput } from '@/server/routers/history/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { useToast } from '@/components/ui/use-toast'
import { TabDataStatus } from '@/types/tab'

type SaveQueryDialogProps = {
  tabId: string
}

export default function SaveQueryDialog({ tabId }: SaveQueryDialogProps) {
  const saveQueryVisible = useStore((store) => store.saveQueryVisible)
  const setSaveQueryVisible = useStore((store) => store.setSaveQueryVisible)
  const tabData = useStore((store) => store.queryTabData[tabId])
  const updateQueryTabData = useStore((store) => store.updateQueryTabData)
  const { toast } = useToast()
  const utils = trpc.useContext()

  const form = useForm<z.infer<typeof createHistoryInput>>({
    resolver: zodResolver(createHistoryInput.required()),
    defaultValues: {
      query: tabData.query,
      resource: tabData.resourceId,
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

  const handleSaveQuery = (values: z.infer<typeof createHistoryInput>) => {
    saveQueryMutation.mutate({ ...values, query: tabData.query, resource: tabData.resourceId })
  }

  return (
    <Dialog open={saveQueryVisible} onOpenChange={setSaveQueryVisible}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Query</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(handleSaveQuery)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter name for your query"
                        disabled={saveQueryMutation.isLoading}
                        {...field}
                      />
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
