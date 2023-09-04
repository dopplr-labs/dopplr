'use client'

import dynamic from 'next/dynamic'
import { useMonaco } from '@monaco-editor/react'
import { useEffect, useRef } from 'react'
import getPgsqlCompletionProvider from '@/lib/code-editor/pqsql-completion-provider'
import getPgsqlSignatureHelpProvider from '@/lib/code-editor/pqsql-signature-help-provider'
import { KEYWORDS, SCHEMAS, TABLE_COLUMNS } from '@/lib/code-editor/data'

const Editor = dynamic(() => import('./_components/editor'), {
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
    <div className="w-full h-screen">
      <Editor defaultLanguage="pgsql" loading={<h1 className="text-sm font-normal">Loading...</h1>} theme="vs-dark" />
    </div>
  )
}
