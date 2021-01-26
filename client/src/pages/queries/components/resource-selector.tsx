import { Select } from 'antd'
import clsx from 'clsx'
import { fetchResources } from 'pages/resources/queries'
import React from 'react'
import { useQuery } from 'react-query'

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
      {resources?.map((resource) => (
        <Select.Option key={resource.id} value={resource.id}>
          {resource.name}
        </Select.Option>
      ))}
    </Select>
  )
}
