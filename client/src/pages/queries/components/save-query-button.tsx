import React, { useContext, useState } from 'react'
import { Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { SavedQuery } from 'types/query'
import SaveQueryModal from './save-query-modal'
import TabsContext from '../contexts/tabs-context'

type SaveQueryButtonProps = {
  query: string
  resourceId: number
}

export default function SaveQueryButton({
  query,
  resourceId,
}: SaveQueryButtonProps) {
  const { tabType, id } = useParams()

  const [saveModalVisible, setSaveModalVisible] = useState(false)

  const { updateTabRoute } = useContext(TabsContext)

  function handleQuerySaveComplete(savedQuery: SavedQuery) {
    updateTabRoute(`${tabType}/${id}`, `saved/${savedQuery.id}`)
  }

  return (
    <>
      <Button
        icon={<SaveOutlined />}
        onClick={() => {
          setSaveModalVisible(true)
        }}
      >
        Save
      </Button>
      <SaveQueryModal
        visible={saveModalVisible}
        onRequestClose={() => {
          setSaveModalVisible(false)
        }}
        query={query}
        resourceId={resourceId}
        onSave={handleQuerySaveComplete}
      />
    </>
  )
}
