import React, { useContext, useEffect, useRef } from 'react'
import MonacoEditor from 'react-monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import {
  MonacoServices,
  Services,
  ErrorAction,
  CloseAction,
  MonacoLanguageClient,
  createConnection,
  Disposable,
} from 'monaco-languageclient'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { listen, MessageConnection } from 'vscode-ws-jsonrpc'
import clsx from 'clsx'
import AuthContext from 'contexts/auth-context'

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
  uid?: string,
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
        uid,
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

type EditorProps = {
  resourceId: number
  value: string
  setValue: (udpatedValue: string) => void
  editorAction?: monaco.editor.IActionDescriptor[]
  className?: string
  style?: React.CSSProperties
}

export default function Editor({
  resourceId,
  value,
  setValue,
  editorAction,
  className,
  style,
}: EditorProps) {
  const editor = useRef<MonacoEditor | null>(null)
  const serviceDisposer = useRef<Disposable | undefined>(undefined)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    let websocket: WebSocket | undefined

    if (editor.current?.editor) {
      websocket = createWebSocket(
        process.env.REACT_APP_LANGUAGE_SERVER_WS as string,
      )

      const service = MonacoServices.create(editor)
      if (serviceDisposer.current) {
        serviceDisposer.current.dispose()
      }
      serviceDisposer.current = Services.install(service)

      listen({
        webSocket: websocket,
        onConnection: (connection) => {
          const languageClient = createLanguageClient(
            connection,
            resourceId,
            user?.uid,
          )
          const disposable = languageClient.start()
          connection.onClose(() => {
            disposable.dispose()
          })
        },
      })
    }

    return () => {
      if (websocket) {
        websocket.close()
      }
    }
  }, [resourceId, user])

  return (
    <div className={clsx('editor h-full', className)} style={style}>
      <MonacoEditor
        language="pgsql"
        theme="vs-light"
        value={value}
        onChange={setValue}
        options={{
          lightbulb: { enabled: true },
          fontFamily: 'JetBrains Mono',
          fontSize: 12,
          lineHeight: 18,
          glyphMargin: false,
          minimap: {
            enabled: false,
          },
          tabSize: 2,
          automaticLayout: true,
        }}
        ref={(monacoEditor) => {
          editor.current = monacoEditor
        }}
        editorDidMount={(editor) => {
          if (editorAction) {
            editorAction.forEach((action) => {
              editor.addAction(action)
            })
          }
        }}
      />
    </div>
  )
}
