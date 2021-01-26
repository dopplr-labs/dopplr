import React from 'react'
import { Form, Input, message, Modal } from 'antd'
import { useMutation, useQueryClient } from 'react-query'
import { SavedQuery } from 'types/query'
import { saveQuery } from '../queries-and-mutations'

type SaveQueryModalProps = {
  visible: boolean
  onRequestClose: () => void
  resourceId: number
  query: string
  onSave?: (savedQuery: SavedQuery) => void
}

export default function SaveQueryModal({
  visible,
  onRequestClose,
  resourceId,
  query,
  onSave,
}: SaveQueryModalProps) {
  const [form] = Form.useForm()

  const queryClient = useQueryClient()
  const { mutate: saveQueryMutation } = useMutation(saveQuery, {
    onSuccess: async (savedQuery) => {
      onRequestClose()
      onSave?.(savedQuery)
      await queryClient.refetchQueries(['saved-queries'])
      message.success('Query saved successfully')
    },
  })

  function handleFinish() {
    const { queryName } = form.getFieldsValue()
    saveQueryMutation({
      resourceId,
      query,
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
      title="Save query"
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        requiredMark={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Query Name"
          name="queryName"
          rules={[
            { required: true, message: 'Please enter name for your query' },
          ]}
        >
          <Input autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  )
}
