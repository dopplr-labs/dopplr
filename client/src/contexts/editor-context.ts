import { createContext } from 'react'
import { QueryResult } from 'types/query'

const EditorContext = createContext<{
  isSaved: boolean
  queryId: string
  queryResult: QueryResult | undefined
}>({
  isSaved: false,
  queryId: '',
  queryResult: undefined,
})

export default EditorContext
