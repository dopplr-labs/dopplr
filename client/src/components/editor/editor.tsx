import React, { forwardRef, useEffect, useRef } from 'react'
import MonacoEditor from 'react-monaco-editor'
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
import sqlFormatter from 'sql-formatter'
import clsx from 'clsx'

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

type EditorProps = {
  resourceId: number
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  className?: string
  style?: React.CSSProperties
}

const Editor = forwardRef(
  (
    { resourceId, value, setValue, className, style }: EditorProps,
    ref: React.Ref<MonacoEditor | null>,
  ): JSX.Element => {
    const editor = useRef<MonacoEditor | null>(null)
    const serviceDisposer = useRef<Disposable | undefined>(undefined)

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
            const languageClient = createLanguageClient(connection, resourceId)
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
    }, [resourceId])

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
            padding: {
              top: 8,
            },
            glyphMargin: false,
            minimap: {
              enabled: false,
            },
            tabSize: 2,
            automaticLayout: true,
          }}
          ref={(monacoEditor) => {
            editor.current = monacoEditor
            if (typeof ref === 'function') {
              ref(monacoEditor)
            } else if (ref !== null) {
              // @ts-ignore
              ref.current = editor
            }
          }}
          editorDidMount={(editor, monaco) => {
            monaco.languages.registerDocumentFormattingEditProvider('pgsql', {
              provideDocumentFormattingEdits: (model) => {
                const formattedText = sqlFormatter.format(model.getValue())
                return [
                  {
                    range: model.getFullModelRange(),
                    text: formattedText,
                  },
                ]
              },
            })
          }}
        />
      </div>
    )
  },
)

Editor.displayName = 'Editor'

export default Editor
