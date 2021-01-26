import { Input, message } from 'antd'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useTabData } from '../hooks/use-tab-data'
import { updateQuery } from '../queries-and-mutations'

type QueryNameProps = {
  savedQueryId: number
}

export default function QueryName({ savedQueryId }: QueryNameProps) {
  const { name, updateName, originalTabData } = useTabData(
    `saved/${savedQueryId}`,
  )
  const [editQueryName, setEditQueryName] = useState(false)

  const queryClient = useQueryClient()
  const { mutate: updateQueryMutation } = useMutation(updateQuery, {
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['saved-queries', savedQueryId], updatedData)
      queryClient.refetchQueries(['saved-queries'])
      queryClient.refetchQueries(['tabs', `saved/${savedQueryId}`])
    },
    onError: (updationError) => {
      message.error((updationError as any).message)
      updateName(originalTabData?.name as string)
    },
  })

  return editQueryName ? (
    <Input
      className="flex-1"
      autoFocus
      value={name}
      onFocus={(event) => {
        event.target.select()
      }}
      onChange={({ target: { value } }) => {
        updateName(value)
      }}
      onPressEnter={() => {
        setEditQueryName(false)
        updateQueryMutation({ queryId: savedQueryId, name })
      }}
      onBlur={() => {
        setEditQueryName(false)
      }}
    />
  ) : (
    <div
      className="flex-1 text-sm cursor-pointer text-content-primary"
      onClick={() => {
        setEditQueryName(true)
      }}
    >
      {name}
    </div>
  )
}
