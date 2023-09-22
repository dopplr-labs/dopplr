'use client'

import dynamic from 'next/dynamic'
import { Loader } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

const Editor = dynamic(() => import('./monaco-editor'), {
  ssr: false,
})

type BaseEditorProps = Omit<React.ComponentProps<typeof Editor>, 'loading' | 'theme'>

export default function BaseEditor({ ...props }: BaseEditorProps) {
  const { theme } = useTheme()
  const mode = useMemo(() => {
    if (theme === 'system') {
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      return isDarkMode ? 'dark' : 'light'
    }
    return theme
  }, [theme])

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
        tabSize: 2,
        fontSize: 13,
        minimap: { enabled: false },
        wordWrap: 'on',
        ...props.options,
      }}
    />
  )
}
