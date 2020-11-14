import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import {
  MonacoServices,
  ErrorAction,
  CloseAction,
  MonacoLanguageClient,
  createConnection,
} from 'monaco-languageclient'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { listen, MessageConnection } from 'vscode-ws-jsonrpc'

function createWebSocket(url: string): WebSocket {
  const socketOptions = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 10000,
    maxRetries: Infinity,
    debug: false,
  }
  return new ReconnectingWebSocket(url, [], socketOptions) as WebSocket
}

function createLanguageClient(
  connection: MessageConnection,
  resourceId: number,
): MonacoLanguageClient {
  return new MonacoLanguageClient({
    name: 'Language Client',
    clientOptions: {
      // use a language id as a document selector
      documentSelector: ['pgsql'],
      // disable the default error handler
      errorHandler: {
        error: () => ErrorAction.Continue,
        closed: () => CloseAction.DoNotRestart,
      },
      initializationOptions: {
        resourceId,
      },
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: (errorHandler, closeHandler) => {
        return Promise.resolve(
          createConnection(connection, errorHandler, closeHandler),
        )
      },
    },
  })
}

type ResourceId = {
  resourceId: number
}

export default function Editor({ resourceId }: ResourceId) {
  const [value, setValue] = useState(
    "SELECT birth_date, photo, hire_date, reports_to FROM employees WHERE country = 'Britain';",
  )
  const websocket = useRef<WebSocket | undefined>()

  function editorDidMount(editor: monacoEditor.editor.IStandaloneCodeEditor) {
    editor.focus()

    websocket.current = createWebSocket(
      process.env.REACT_APP_LANGUAGE_SERVER_WS as string,
    )

    MonacoServices.install(editor)

    listen({
      webSocket: websocket.current,
      onConnection: (connection) => {
        const languageClient = createLanguageClient(connection, resourceId)
        const disposable = languageClient.start()
        connection.onClose(() => disposable.dispose())
      },
    })
  }

  useEffect(() => {
    return () => {
      if (websocket.current) {
        websocket.current.close()
      }
    }
  }, [])

  return (
    <div className="editor">
      <MonacoEditor
        height="400"
        language="pgsql"
        theme="vs-light"
        value={value}
        onChange={setValue}
        options={{
          lightbulb: { enabled: true },
          fontFamily: 'JetBrains Mono',
          fontSize: 12,
          lineHeight: 18,
          padding: {
            top: 8,
          },
          glyphMargin: false,
          minimap: {
            enabled: false,
          },
        }}
        editorDidMount={editorDidMount}
      />
    </div>
  )
}
