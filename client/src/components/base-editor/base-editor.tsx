import React, { forwardRef, useContext } from 'react'
import clsx from 'clsx'
import useMeasure from 'react-use-measure'
import AceEditor, { ICommand } from 'react-ace'
// syntax
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/mode-pgsql'
import 'ace-builds/src-noconflict/mode-mysql'
import 'ace-builds/src-noconflict/ext-language_tools'
// keybindings
import 'ace-builds/src-noconflict/keybinding-vim'
import 'ace-builds/src-noconflict/keybinding-emacs'
import 'ace-builds/src-noconflict/keybinding-vscode'
// themes
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-clouds'
import 'ace-builds/src-noconflict/theme-crimson_editor'
import 'ace-builds/src-noconflict/theme-dawn'
import 'ace-builds/src-noconflict/theme-dreamweaver'
import 'ace-builds/src-noconflict/theme-eclipse'
import 'ace-builds/src-noconflict/theme-iplastic'
import 'ace-builds/src-noconflict/theme-solarized_light'
import 'ace-builds/src-noconflict/theme-textmate'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/theme-kuroir'
import 'ace-builds/src-noconflict/theme-katzenmilch'
import 'ace-builds/src-noconflict/theme-sqlserver'
import 'ace-builds/src-noconflict/theme-ambiance'
import 'ace-builds/src-noconflict/theme-chaos'
import 'ace-builds/src-noconflict/theme-clouds_midnight'
import 'ace-builds/src-noconflict/theme-dracula'
import 'ace-builds/src-noconflict/theme-cobalt'
import 'ace-builds/src-noconflict/theme-gruvbox'
import 'ace-builds/src-noconflict/theme-gob'
import 'ace-builds/src-noconflict/theme-idle_fingers'
import 'ace-builds/src-noconflict/theme-kr_theme'
import 'ace-builds/src-noconflict/theme-merbivore'
import 'ace-builds/src-noconflict/theme-merbivore_soft'
import 'ace-builds/src-noconflict/theme-mono_industrial'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-nord_dark'
import 'ace-builds/src-noconflict/theme-pastel_on_dark'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/theme-tomorrow_night'
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue'
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright'
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/theme-vibrant_ink'
import SettingsContext from 'contexts/settings-context'
import { KeyBinding } from 'types/settings'

type BaseEditorProps = {
  value: string
  setValue: (updatedValue: string) => void
  syntax?: string
  commands?: ICommand[]
  className?: string
  style?: React.CSSProperties
}

const BaseEditor = forwardRef(
  (
    {
      value,
      setValue,
      syntax = 'sql',
      commands = [],
      className,
      style,
    }: BaseEditorProps,
    ref: React.Ref<AceEditor>,
  ) => {
    const [measure, containerBounds] = useMeasure()

    const { textEditorSettings } = useContext(SettingsContext)

    return (
      <div
        ref={measure}
        className={clsx('w-full h-full', className)}
        style={style}
      >
        <AceEditor
          ref={ref}
          mode={syntax}
          theme={textEditorSettings.theme as string}
          value={value}
          onChange={setValue}
          width={`${containerBounds?.width ?? 0}px`}
          height={`${containerBounds?.height ?? 0}px`}
          enableBasicAutocompletion
          enableLiveAutocompletion
          editorProps={{ $blockScrolling: true }}
          keyboardHandler={
            textEditorSettings.keyBinding === KeyBinding.NONE
              ? undefined
              : (textEditorSettings.keyBinding as string)
          }
          fontSize={textEditorSettings.fontSize as number}
          setOptions={{
            fontSize: textEditorSettings.fontSize as number,
            fontFamily: textEditorSettings.fontFamily as string,
            scrollPastEnd: true,
            wrap: textEditorSettings.wordWrap as boolean,
            autoScrollEditorIntoView: true,
            showLineNumbers: textEditorSettings.lineNumbers as boolean,
            tabSize: textEditorSettings.tabSize as number,
            useSoftTabs: true,
            showPrintMargin: false,
            highlightActiveLine: true,
          }}
          style={{
            lineHeight: `${textEditorSettings.lineHeight}px`,
            fontWeight: textEditorSettings.fontWeight as number,
          }}
          commands={commands}
        />
      </div>
    )
  },
)

BaseEditor.displayName = 'BaseEditor'

export default BaseEditor
