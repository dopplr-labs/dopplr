import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from './input'

type EditableInputProps = {
  className?: string
  style?: React.CSSProperties
  editable?: boolean
  value?: string
  onChange?: (value: string) => void
}

export default function EditableInput({ className, style, editable, value, onChange }: EditableInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={className} style={style}>
      {editable && focused ? (
        <Input
          autoFocus
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value)
          }}
          onBlur={() => {
            setFocused(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setFocused(false)
            }
          }}
        />
      ) : (
        <div
          className={cn('w-max rounded-md px-1', editable && 'hover:bg-muted')}
          onClick={() => {
            setFocused(true)
          }}
        >
          {value}
        </div>
      )}
    </div>
  )
}
