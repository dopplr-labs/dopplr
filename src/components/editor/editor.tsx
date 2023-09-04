'use client'

import dynamic from 'next/dynamic'
import { useMonaco } from '@monaco-editor/react'
import { useEffect, useRef } from 'react'
import { Loader } from 'lucide-react'
import getPgsqlCompletionProvider from '@/lib/code-editor/pqsql-completion-provider'
import getPgsqlSignatureHelpProvider from '@/lib/code-editor/pqsql-signature-help-provider'
import { KEYWORDS, SCHEMAS, TABLE_COLUMNS } from '@/lib/code-editor/data'

const Editor = dynamic(() => import('./monaco-editor'), {
  ssr: false,
})

export default function Home() {
  const monaco = useMonaco()
  const pgInfoRef = useRef<any>(null)

  useEffect(
    function registerCompletions() {
      if (monaco) {
        pgInfoRef.current = {}
        pgInfoRef.current.tableColumns = TABLE_COLUMNS
        pgInfoRef.current.schemas = SCHEMAS
        pgInfoRef.current.keywords = KEYWORDS.map((keyword) => keyword.word)
        pgInfoRef.current.functions = []

        monaco.languages.registerCompletionItemProvider('pgsql', getPgsqlCompletionProvider(monaco, pgInfoRef))
        monaco.languages.registerSignatureHelpProvider('pgsql', getPgsqlSignatureHelpProvider(monaco, pgInfoRef))
      }
    },
    [monaco],
  )

  return (
    <div className="h-full w-full">
      <Editor
        defaultLanguage="pgsql"
        loading={
          <div className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            <h1 className="text-xs font-medium text-muted-foreground">Loading Editor...</h1>
          </div>
        }
        theme="vs-dark"
      />
    </div>
  )
}
