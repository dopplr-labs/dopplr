'use client'

import dynamic from 'next/dynamic'
import { Loader } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useMemo } from 'react'
import { useMonaco } from '@monaco-editor/react'
import { mono } from '@/lib/fonts'

const Editor = dynamic(() => import('./monaco-editor'), {
  ssr: false,
})

type BaseEditorProps = Omit<React.ComponentProps<typeof Editor>, 'loading' | 'theme'>

export default function BaseEditor({ ...props }: BaseEditorProps) {
  const monaco = useMonaco()

  const { theme } = useTheme()
  const mode = useMemo(() => {
    if (theme === 'system') {
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      return isDarkMode ? 'dark' : 'light'
    }
    return theme
  }, [theme])

  useEffect(
    function handleKeyboardShortcuts() {
      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'p' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault()
          event.stopPropagation()
          if (monaco) {
            monaco.editor.getEditors()?.[0]?.trigger('anyString', 'editor.action.quickCommand', {})
          }
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    },
    [monaco],
  )

  return (
    <Editor
      {...props}
      loading={
        <div className="flex items-center gap-2">
          <Loader className="h-4 w-4 animate-spin" />
          <h1 className="text-xs font-medium text-muted-foreground">Loading Editor...</h1>
        </div>
      }
      theme={mode === 'dark' ? 'vs-dark' : 'vs-light'}
      onMount={(editor, ...args) => {
        // add margin above first line
        editor.changeViewZones((accessor) => {
          accessor.addZone({
            afterLineNumber: 0,
            heightInPx: 8,
            domNode: document.createElement('div'),
          })
        })
        props.onMount?.(editor, ...args)
      }}
      options={{
        ...props.options,
        tabSize: 2,
        fontSize: 13,
        minimap: { enabled: false },
        wordWrap: 'on',
        fontFamily: mono.style.fontFamily,
      }}
    />
  )
}
