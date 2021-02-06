import { Select } from 'antd'
import clsx from 'clsx'
import { fetchResources } from 'pages/resources/queries'
import React from 'react'
import { useQuery } from 'react-query'
import { getResource } from 'utils/resource'

type ResourceSelectorProps = {
  resource?: number
  onChange: (resource: number) => void
  className?: string
  style?: React.CSSProperties
}

export default function ResourceSelector({
  resource,
  onChange,
  className,
  style,
}: ResourceSelectorProps) {
  const { isLoading, data: resources } = useQuery(['resources'], fetchResources)

  if (isLoading) {
    return (
      <div
        className={clsx(
          'w-48 h-10 bg-background-secondary animate-pulse',
          className,
        )}
        style={style}
      />
    )
  }

  return (
    <Select
      placeholder="Select a resource"
      value={resource}
      onChange={onChange}
      className={clsx('w-48', className)}
      style={style}
    >
      {resources?.map((resource) => {
        const resourceImage = getResource(resource.type)?.image
        return (
          <Select.Option key={resource.id} value={resource.id}>
            <div className="flex items-center space-x-3">
              {resourceImage ? (
                <img src={resourceImage} className="object-contain w-4 h-4" />
              ) : null}
              <span>{resource.name}</span>
            </div>
          </Select.Option>
        )
      })}
    </Select>
  )
}
