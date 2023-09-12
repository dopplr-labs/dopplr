'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { type Resource } from '@/db/schema/resource'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc/client'

type DeleteResourceProps = {
  resource: Resource
  className?: string
  style?: React.CSSProperties
}

export default function DeleteResource({ resource, className, style }: DeleteResourceProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const router = useRouter()

  const getResources = trpc.resource.getResources.useQuery()
  const deleteResourceMutation = trpc.resource.deleteResource.useMutation({
    onSuccess: () => {
      getResources.refetch()
      router.replace('/resources')
    },
  })

  return (
    <Card className={cn('max-w-screen-lg', className)} style={style}>
      <CardContent className="flex items-center pt-6">
        <div className="flex-1">
          <div>Delete this resource</div>
          <div className="text-sm text-muted-foreground">
            Once you delete a resource, there is no going back. Please be certain.
          </div>
        </div>
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete this resource and all associated data like queries, dashboards, etc.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild variant="destructive">
                <Button
                  onClick={(event) => {
                    event.preventDefault()
                    deleteResourceMutation.mutate({ id: resource.id })
                  }}
                  loading={deleteResourceMutation.isLoading}
                >
                  Delete
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
