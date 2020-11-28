import React, { useState } from 'react'
import { Input } from 'antd'
import { useSyncedState } from 'hooks/use-synced-states'
import { Tab, TabType } from 'types/tab'

type QueryNameProps = {
  tab: Tab
  onUpdate: (updatedName: string) => void
  className?: string
  style?: React.CSSProperties
}

export default function QueryName({
  tab,
  onUpdate,
  className,
  style,
}: QueryNameProps) {
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useSyncedState(
    tab.type === TabType.SAVED_QUERY ? tab.data.name : '',
  )

  if (tab.type !== TabType.SAVED_QUERY) {
    return null
  }

  return (
    <div className={className} style={style}>
      {editMode ? (
        <Input
          className="w-full"
          autoFocus
          value={name}
          onFocus={(event) => {
            event.target.select()
          }}
          onChange={(event) => {
            setName(event.target.value)
          }}
          onPressEnter={() => {
            setEditMode(false)
            onUpdate(name)
          }}
          onBlur={() => {
            setEditMode(false)
            onUpdate(name)
          }}
        />
      ) : (
        <div
          className="w-full text-sm text-gray-800 truncate cursor-pointer"
          onClick={() => {
            setEditMode(true)
          }}
        >
          {tab.data.name}
        </div>
      )}
    </div>
  )
}
