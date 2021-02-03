import React, { useRef } from 'react'
import AceEditor from 'react-ace'
import BaseEditor from 'components/base-editor'
import { useQuery } from 'react-query'
import { fetchSchema } from 'queries/resource'
import { updateCompletion } from './utils'

type EditorProps = {
  resourceId: number
} & React.ComponentProps<typeof BaseEditor>

export default function Editor({
  resourceId,
  ...restEditorProps
}: EditorProps) {
  const editor = useRef<AceEditor>(null)
  useQuery(['schema', resourceId], () => fetchSchema(resourceId), {
    onSuccess: (data) => {
      const editorId = editor.current?.editor.id
      if (editorId && data) {
        updateCompletion(editorId, data)
      }
    },
  })

  return <BaseEditor {...restEditorProps} ref={editor} />
}
