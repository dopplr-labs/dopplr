import { match } from 'ts-pattern'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import { trpc } from '@/lib/trpc/client'
import { Skeleton } from '@/components/ui/skeleton'

export default function ResourceSelector() {
  const getResourcesQuery = trpc.resource.getResources.useQuery()

  return match(getResourcesQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => <Skeleton className="h-9 w-64" />)
    .with({ status: 'error' }, () => null)
    .with({ status: 'success' }, ({ data: resources }) => (
      <Select>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select Resource" />
        </SelectTrigger>
        <SelectContent className="w-64">
          {resources.map((resource) => {
            return (
              <SelectItem value={`resource-${resource.id}`} key={resource.id}>
                {resource.name}
              </SelectItem>
            )
          })}
          <SelectSeparator />
          <SelectItem value="resource-new">Create New Resource</SelectItem>
        </SelectContent>
      </Select>
    ))
    .exhaustive()
}
