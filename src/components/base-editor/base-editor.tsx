'use client'

import dynamic from 'next/dynamic'
import { Loader } from 'lucide-react'

const Editor = dynamic(() => import('./monaco-editor'), {
  ssr: false,
})

type BaseEditorProps = Omit<React.ComponentProps<typeof Editor>, 'loading' | 'theme'>

export default function BaseEditor({ ...props }: BaseEditorProps) {
  return (
    <Editor
      {...props}
      loading={
        <div className="flex items-center gap-2">
          <Loader className="h-4 w-4 animate-spin" />
          <h1 className="text-xs font-medium text-muted-foreground">Loading Editor...</h1>
        </div>
      }
      theme="vs-dark"
    />
  )
}
