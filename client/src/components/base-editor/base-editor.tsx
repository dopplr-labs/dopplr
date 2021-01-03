import React, { forwardRef, useContext } from 'react'
import clsx from 'clsx'
import MonacoEditor from 'react-monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
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

    return (
      <div className={clsx('editor h-full', className)} style={style}>
        <MonacoEditor
          language="pgsql"
          theme="vs-light"
          value={value}
          onChange={setValue}
          options={settingsRemap(textEditorSettings)}
          ref={ref}
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
