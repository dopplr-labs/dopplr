'use client'

import dynamic from 'next/dynamic'
import { Loader } from 'lucide-react'
import { useTheme } from 'next-themes'

const Editor = dynamic(() => import('./monaco-editor'), {
  ssr: false,
})

type BaseEditorProps = Omit<React.ComponentProps<typeof Editor>, 'loading' | 'theme'>

export default function BaseEditor({ ...props }: BaseEditorProps) {
  const { theme } = useTheme()

  return (
    <Editor
      {...props}
      loading={
        <div className="flex items-center gap-2">
          <Loader className="h-4 w-4 animate-spin" />
          <h1 className="text-xs font-medium text-muted-foreground">Loading Editor...</h1>
        </div>
      }
      theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
      onMount={(editor) => {
        // add margin above first line
        editor.changeViewZones((accessor) => {
          accessor.addZone({
            afterLineNumber: 0,
            heightInPx: 8,
            domNode: document.createElement('div'),
          })
        })
      }}
      options={{
        tabSize: 2,
        fontSize: 13,
        minimap: { enabled: false },
        wordWrap: 'on',
      }}
    />
  )
}
