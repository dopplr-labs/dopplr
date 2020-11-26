import React, { useMemo, useState } from 'react'
import { Dropdown, Form, Input, Menu, message, Modal, Typography } from 'antd'
import {
  DeleteOutlined,
  EllipsisOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { queryCache, useMutation, useQuery } from 'react-query'
import { History } from 'types/history'
import {
  deleteQuery,
  fetchSavedQueries,
  saveQuery,
} from '../queries-and-mutations'

export default function HistoryQuery({ query }: { query: History }) {
  const history: History[] | undefined = queryCache.getQueryData(['history'])
  const [show, setShow] = useState(false)

  const [form] = Form.useForm()

  const { data: savedQueries } = useQuery(['saved-queries'], fetchSavedQueries)

  const [saveQueryMutation] = useMutation(saveQuery, {
    onSuccess: (savedQuery) => {
      queryCache.setQueryData(
        ['saved-queries'],
        savedQueries ? [savedQuery, ...savedQueries] : [savedQuery],
      )
      message.success('Query saved successfully')
    },
  })
  function handleFinish() {
    const { queryName } = form.getFieldsValue()
    saveQueryMutation({
      resourceId: query.resource.id,
      query: query.query,
      name: queryName,
    })
  }

  function handleModalCancel() {
    setShow(false)
  }

  function handleModalOk() {
    form.submit()
    setShow(false)
  }

  const [deleteQueryMutation] = useMutation(deleteQuery, {
    onMutate: (deletedQueryId) => {
      queryCache.setQueryData(
        ['history'],
        history?.filter((data) => data.id !== deletedQueryId),
      )
    },
  })

  const historyMenu = useMemo(() => {
    return (
      <Menu>
        <Menu.Item
          key="0"
          className="flex items-center space-x-2 text-xs"
          onClick={() => {
            setShow(true)
          }}
        >
          <SaveOutlined />
          <span>Save Query</span>
        </Menu.Item>
        <Menu.Item
          key="1"
          className="flex items-center space-x-2 text-xs"
          onClick={() => {
            deleteQueryMutation(query.id)
          }}
        >
          <DeleteOutlined />
          <span>Clear</span>
        </Menu.Item>
      </Menu>
    )
  }, [deleteQueryMutation, query.id])

  return (
    <>
      <li className="flex items-center justify-between py-1 pl-8 pr-3 space-x-1 text-xs cursor-pointer hover:bg-gray-50 group">
        <Typography.Paragraph
          ellipsis={{ rows: 1, expandable: true, symbol: 'more' }}
        >
          {query.query}
        </Typography.Paragraph>
        <Dropdown overlay={historyMenu} trigger={['click']}>
          <button className="invisible px-1 focus:outline-none group-hover:visible">
            <EllipsisOutlined className="text-lg" />
          </button>
        </Dropdown>
      </li>

      <Modal
        visible={show}
        title="Name your query"
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          requiredMark={false}
          onFinish={handleFinish}
        >
          <Form.Item
            label="Query Name:"
            name="queryName"
            rules={[
              { required: true, message: 'Please enter name for your query' },
            ]}
          >
            <Input autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
