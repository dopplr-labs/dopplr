'use client'

import { useMonaco } from '@monaco-editor/react'
import React, { useEffect, useRef } from 'react'
import BaseEditor from '../base-editor'
import getPgsqlCompletionProvider from '@/lib/code-editor/pqsql-completion-provider'
import getPgsqlSignatureHelpProvider from '@/lib/code-editor/pqsql-signature-help-provider'
import { type Resource } from '@/db/schema/resource'
import { trpc } from '@/lib/trpc/client'
import { getFunctionsQuery, getKeywordsQuery, getSchemasQuery, getTableColumnsQuery } from '@/lib/pg/sql-queries'
import { DatabaseFunction, DatabaseKeyword, Schema, TableColumn } from '@/types/database'

type PgEditorProps = Omit<React.ComponentProps<typeof BaseEditor>, 'defaultLanguage'> & {
  resource: Resource
}

export default function PgEditor({ resource, ...props }: PgEditorProps) {
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
          async provideDocumentFormattingEdits(model: any) {
            const value = model.getValue()
            return [
              {
                range: model.getFullModelRange(),
                text: value,
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
    [isPgInfoReady, monaco],
  )

  return (
    <BaseEditor
      {...props}
      defaultLanguage="pgsql"
      onMount={(editor, monaco) => {
        editor.addAction({
          id: 'run-query',
          label: 'Run Query',
          keybindings: [monaco.KeyMod.CtrlCmd + monaco.KeyCode.Enter],
          contextMenuGroupId: 'operation',
          contextMenuOrder: 0,
          run() {
            // eslint-disable-next-line no-console
            console.log('running query')
          },
        })
      }}
    />
  )
}
