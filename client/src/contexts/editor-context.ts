import { createContext } from 'react'
import { QueryResult } from 'types/query'

const EditorContext = createContext<{
  isSaved: boolean
  queryId: string
  queryResult: QueryResult | null
}>({
  isSaved: false,
  queryId: '',
  queryResult: null,
})

export default EditorContext
