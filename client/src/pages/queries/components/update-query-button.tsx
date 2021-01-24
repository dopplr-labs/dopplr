import React from 'react'
import { Button, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from 'react-query'
import { useTabData } from '../hooks/use-tab-data'
import { updateQuery } from '../queries-and-mutations'

type UpdateQueryButtonProps = {
  savedQueryId: number
}

export default function UpdateQueryButton({
  savedQueryId,
}: UpdateQueryButtonProps) {
  const queryClient = useQueryClient()
  const { query, resourceId } = useTabData(`saved/${savedQueryId}`)

  const {
    mutate: updateQueryMutation,
    isLoading: isUpdatingQuery,
  } = useMutation(updateQuery, {
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['saved-queries', savedQueryId], updatedData)
      queryClient.refetchQueries(['saved-queries'])
      queryClient.refetchQueries(['tabs', `saved/${savedQueryId}`])
    },
    onError: (updationError) => {
      message.error((updationError as any).message)
    },
  })

  return (
    <Button
      icon={<SaveOutlined />}
      loading={isUpdatingQuery}
      disabled={isUpdatingQuery}
      onClick={() => {
        updateQueryMutation({
          queryId: savedQueryId,
          query,
          resource: resourceId,
        })
      }}
    >
      Save
    </Button>
  )
}
