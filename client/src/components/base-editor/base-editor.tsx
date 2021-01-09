import React, { forwardRef, useContext, useEffect, useRef } from 'react'
import clsx from 'clsx'
import MonacoEditor from 'react-monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
// @ts-ignore
import { initVimMode } from 'monaco-vim'
import { EmacsExtension } from 'monaco-emacs'
import {
  BaseSettings,
  LineNumber,
  CursorBlinking,
  WordWrap,
  MiniMapShowSlider,
  MiniMapSide,
  MiniMapSize,
  MinimapScale,
  KeyBinding,
} from 'types/settings'
import { kebabCase } from 'lodash'
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
    const { keyBinding, theme } = textEditorSettings

    const editorPlugin = useRef<any>(undefined)
    const editor = useRef<monaco.editor.IStandaloneCodeEditor | undefined>(
      undefined,
    )
    const actionsContainer = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      // if there is any previous editorPlugin initialized, it can be safely disposed
      editorPlugin.current?.dispose()

      if (!editor.current || !actionsContainer.current) {
        return
      }

      switch (keyBinding) {
        case KeyBinding.VIM: {
          if (actionsContainer.current) {
            editorPlugin.current = initVimMode(
              editor.current,
              actionsContainer.current,
            )
          }
          break
        }
        case KeyBinding.EMACS: {
          editorPlugin.current = initEmacsMode(
            editor.current,
            actionsContainer.current,
          )
        }
      }
    }, [keyBinding])

    useTheme(theme as string)

    return (
      <div className={clsx('editor h-full', className)} style={style}>
        <div
          style={{
            height: keyBinding !== 'none' ? 'calc(100% - 24px)' : '100%',
          }}
        >
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
        {keyBinding !== KeyBinding.NONE ? (
          <div className="flex items-center h-6 px-2 text-xs border-t text-content-tertiary">
            <div ref={actionsContainer} />
          </div>
        ) : null}
      </div>
    )
  },
)

BaseEditor.displayName = 'BaseEditor'

export default BaseEditor

function initEmacsMode(
  editor: monaco.editor.IStandaloneCodeEditor,
  actionsContainer: HTMLDivElement,
) {
  const boundEditor = new EmacsExtension(editor)
  boundEditor.onDidMarkChange((ev: any) => {
    if (actionsContainer !== null)
      actionsContainer.textContent = ev ? 'Mark Set!' : 'Mark Unset'
  })
  boundEditor.onDidChangeKey((str: string) => {
    if (actionsContainer !== null) actionsContainer.textContent = str
  })
  boundEditor.start()
  return boundEditor
}

function useTheme(theme: string) {
  useEffect(() => {
    if (theme !== 'default') {
      const themeKey = kebabCase(theme)
      import(`monaco-themes/themes/${theme}.json`).then((data) => {
        monaco.editor.defineTheme(themeKey as string, data)
        monaco.editor.setTheme(themeKey as string)
      })
    } else {
      monaco.editor.setTheme('vs')
    }
  }, [theme])
}

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
    cursorSmoothCaretAnimation: textEditorSettings.cursorSmoothCaretAnimation as boolean,
    glyphMargin: false,
    minimap: {
      enabled: textEditorSettings.minimapEnable as boolean,
      maxColumn: textEditorSettings.minimapMaxColumn as number,
      renderCharacters: textEditorSettings.minimapRenderCharacters as boolean,
      scale: textEditorSettings.minimapScale as MinimapScale,
      showSlider: textEditorSettings.minimapShowSlider as MiniMapShowSlider,
      side: textEditorSettings.minimapSide as MiniMapSide,
      size: textEditorSettings.minimapSize as MiniMapSize,
    },
    tabSize: 2,
    useTabStops: true,
    automaticLayout: true,
    wordWrap: textEditorSettings.wordWrap as WordWrap,
  }
}
