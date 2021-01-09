import React, { forwardRef, useContext, useEffect, useRef } from 'react'
import clsx from 'clsx'
import MonacoEditor from 'react-monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
// @ts-ignore
import { initVimMode } from 'monaco-vim'
import {
  BaseSettings,
  LineNumber,
  CursorBlinking,
  WordWrap,
} from 'types/settings'
import SettingsContext from 'contexts/settings-context'

type BaseEditorProps = {
  value: string
  setValue: (udpatedValue: string) => void
  editorAction?: monaco.editor.IActionDescriptor[]
  className?: string
  style?: React.CSSProperties
}

const BaseEditor = forwardRef(
  (
    { value, setValue, editorAction, className, style }: BaseEditorProps,
    ref: React.Ref<MonacoEditor>,
  ) => {
    const { textEditorSettings } = useContext(SettingsContext)

    const vimEnabled = textEditorSettings.vim
    const vimMode = useRef<any>(undefined)

    const editor = useRef<monaco.editor.IStandaloneCodeEditor | undefined>(
      undefined,
    )
    const vimActionsContainer = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      if (editor.current && vimEnabled && vimActionsContainer.current) {
        vimMode.current = initVimMode(
          editor.current,
          vimActionsContainer.current,
        )
      } else if (!vimEnabled && vimMode.current) {
        vimMode.current.dispose()
      }
    }, [vimEnabled])

    return (
      <div className={clsx('editor h-full', className)} style={style}>
        <div style={{ height: vimEnabled ? 'calc(100% - 24px)' : '100%' }}>
          <MonacoEditor
            language="pgsql"
            theme="vs-light"
            value={value}
            onChange={setValue}
            options={settingsRemap(textEditorSettings)}
            ref={ref}
            editorDidMount={(mountedEditor) => {
              editor.current = mountedEditor
              if (editorAction) {
                editorAction.forEach((action) => {
                  mountedEditor.addAction(action)
                })
              }
            }}
          />
        </div>
        {textEditorSettings.vim ? (
          <div className="flex items-center h-6 px-2 text-xs border-t text-content-tertiary">
            <div ref={vimActionsContainer} />
          </div>
        ) : null}
      </div>
    )
  },
)

BaseEditor.displayName = 'BaseEditor'

export default BaseEditor

function settingsRemap(
  textEditorSettings: BaseSettings,
): Partial<monaco.editor.IStandaloneEditorConstructionOptions> {
  return {
    lightbulb: { enabled: true },
    fontFamily: textEditorSettings.fontFamily as string,
    fontSize: textEditorSettings.fontSize as number,
    fontWeight: textEditorSettings.fontWeight as string,
    lineHeight: textEditorSettings.lineHeight as number,
    fontLigatures: textEditorSettings.fontLigatures as boolean,
    lineNumbers: textEditorSettings.lineNumbers as LineNumber,
    cursorBlinking: textEditorSettings.cursorBlinking as CursorBlinking,
    cursorSmoothCaretAnimation: textEditorSettings.textEditorSettings as boolean,
    glyphMargin: false,
    minimap: {
      enabled: false,
    },
    tabSize: 2,
    useTabStops: true,
    automaticLayout: true,
    wordWrap: textEditorSettings.wordWrap as WordWrap,
  }
}
