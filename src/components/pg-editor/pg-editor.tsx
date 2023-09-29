'use client'

import React, { useEffect, useRef } from 'react'
import { useMonaco } from '@monaco-editor/react'
import { z } from 'zod'
import BaseEditor from '../base-editor'
import getPgsqlCompletionProvider from '@/lib/code-editor/pqsql-completion-provider'
import getPgsqlSignatureHelpProvider from '@/lib/code-editor/pqsql-signature-help-provider'
import { type Resource } from '@/db/schema/resource'
import { trpc } from '@/lib/trpc/client'
import { getFunctionsQuery, getKeywordsQuery, getSchemasQuery, getTableColumnsQuery } from '@/lib/pg/sql-queries'
import { DatabaseFunction, DatabaseKeyword, Schema, TableColumn } from '@/types/database'
import { formatQueryInput, runQueryInput } from '@/server/routers/query/input'

type PgEditorProps = Omit<React.ComponentProps<typeof BaseEditor>, 'defaultLanguage'> & {
  resource: Resource
  format: (input: z.infer<typeof formatQueryInput>) => Promise<string>
  runQuery: (input: z.infer<typeof runQueryInput>) => void
}

export default function PgEditor({ resource, format, runQuery, ...props }: PgEditorProps) {
  const monaco = useMonaco()
  const pgInfoRef = useRef<any>(null)

  const connectionString = (resource.connectionConfig as unknown as { url: string }).url

  const keywordsQuery = trpc.query.runQuery.useQuery({
    type: 'postgres',
    connectionString,
    query: getKeywordsQuery(),
  })
  const functionsQuery = trpc.query.runQuery.useQuery({
    type: 'postgres',
    connectionString,
    query: getFunctionsQuery(),
  })
  const schemasQuery = trpc.query.runQuery.useQuery({
    type: 'postgres',
    connectionString,
    query: getSchemasQuery(),
  })
  const tablesQuery = trpc.query.runQuery.useQuery({
    type: 'postgres',
    connectionString,
    query: getTableColumnsQuery(),
  })

  const isPgInfoReady =
    keywordsQuery.isSuccess && functionsQuery.isSuccess && schemasQuery.isSuccess && tablesQuery.isSuccess

  if (isPgInfoReady) {
    if (pgInfoRef.current === null) {
      pgInfoRef.current = {}
    }
    pgInfoRef.current.tableColumns = (tablesQuery?.data as unknown as TableColumn[]) ?? []
    pgInfoRef.current.schemas = (schemasQuery?.data as unknown as Schema[]) ?? []
    pgInfoRef.current.keywords = ((keywordsQuery?.data as unknown as DatabaseKeyword[]) ?? []).map((keyword) =>
      keyword.word.toLocaleLowerCase(),
    )
    pgInfoRef.current.functions = ((functionsQuery?.data as unknown as DatabaseFunction[]) ?? []).map((func) =>
      func.argument_types
        .split(',')
        .filter((a: any) => a)
        .map((a: any) => a.trim()),
    )
  }

  useEffect(
    function registerCompletions() {
      if (monaco) {
        const completionItemProvider = monaco.languages.registerCompletionItemProvider(
          'pgsql',
          getPgsqlCompletionProvider(monaco, pgInfoRef),
        )
        const signatureHelpProvider = monaco.languages.registerSignatureHelpProvider(
          'pgsql',
          getPgsqlSignatureHelpProvider(monaco, pgInfoRef),
        )

        // Enable pgsql format
        const formatprovider = monaco.languages.registerDocumentFormattingEditProvider('pgsql', {
          async provideDocumentFormattingEdits(model) {
            const value = model.getValue()
            const formattedText = await format({ type: resource.type, query: value })
            return [
              {
                range: model.getFullModelRange(),
                text: formattedText,
              },
            ]
          },
        })

        return () => {
          formatprovider.dispose()
          completionItemProvider.dispose()
          signatureHelpProvider.dispose()
        }
      }
    },
    [isPgInfoReady, monaco, format, resource],
  )

  return (
    <BaseEditor
      {...props}
      defaultLanguage="pgsql"
      onMount={(editor, monaco) => {
        editor.addAction({
          id: 'editor.action.runQuery',
          label: 'Run Query',
          keybindings: [monaco.KeyMod.CtrlCmd + monaco.KeyCode.Enter],
          contextMenuGroupId: 'operation',
          contextMenuOrder: 0,
          run(editor) {
            const query = editor.getValue()
            if (query) {
              runQuery({
                type: resource.type,
                connectionString: (resource.connectionConfig as unknown as { url: string }).url,
                query,
              })
            }
          },
        })

        props.onMount?.(editor, monaco)
      }}
    />
  )
}
