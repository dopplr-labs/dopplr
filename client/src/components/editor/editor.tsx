import React, { useMemo, useRef } from 'react'
import AceEditor from 'react-ace'
import BaseEditor from 'components/base-editor'
import { useQuery } from 'react-query'
import { fetchSchema, fetchResource } from 'queries/resource'
import { getResource } from 'utils/resource'
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

  const { data: resource } = useQuery(['resources', resourceId], () =>
    fetchResource(resourceId.toString()),
  )
  const editorSyntax = useMemo(() => {
    if (resource) {
      return getResource(resource.type)?.editorSyntax
    }
    return undefined
  }, [resource])

  return <BaseEditor {...restEditorProps} ref={editor} syntax={editorSyntax} />
}
