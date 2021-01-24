import React from 'react'
import { Form, Input, message, Modal } from 'antd'
import { useQueryClient, useMutation } from 'react-query'
import { updateQuery } from '../queries-and-mutations'
import { useTabData } from '../hooks/use-tab-data'

type RenameQueryModalProps = {
  visible: boolean
  onRequestClose: () => void
  queryId: number
  queryName: string
}

export default function RenameQueryModal({
  visible,
  onRequestClose,
  queryId,
  queryName,
}: RenameQueryModalProps) {
  const [form] = Form.useForm()

  const { updateName } = useTabData(`saved/${queryId}`)

  const queryClient = useQueryClient()
  const { mutate: updateQueryMutation, isLoading: renamingQuery } = useMutation(
    updateQuery,
    {
      onSuccess: (updatedData) => {
        message.success('Query updated successfully')
        updateName(updatedData.name)
        queryClient.setQueryData(['saved-queries', queryId], updatedData)
        queryClient.refetchQueries(['saved-queries'])
        queryClient.refetchQueries(['tabs', `saved/${queryId}`])
        onRequestClose()
      },
    },
  )

  function handleFinish() {
    const { queryName } = form.getFieldsValue()
    updateQueryMutation({
      queryId,
      name: queryName,
    })
  }

  function handleOk() {
    form.submit()
  }

  function handleCancel() {
    onRequestClose()
  }

  return (
    <Modal
      visible={visible}
      title="Rename query"
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
      okButtonProps={{
        loading: renamingQuery,
      }}
    >
      <Form
        layout="vertical"
        form={form}
        requiredMark={false}
        onFinish={handleFinish}
        initialValues={{ queryName }}
      >
        <Form.Item
          label="Query Name"
          name="queryName"
          rules={[
            { required: true, message: 'Please enter name for your query' },
          ]}
        >
          <Input
            autoFocus
            onFocus={(event) => {
              event.target.select()
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
