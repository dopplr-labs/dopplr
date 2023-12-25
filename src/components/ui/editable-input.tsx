import { useState } from 'react'
import { PencilIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div
      data-editable={editable}
      className={cn(
        'relative after:pointer-events-none after:absolute after:-inset-1 after:rounded-md after:bg-muted after:opacity-0 after:transition-all data-[editable="true"]:hover:after:opacity-100',
        className,
      )}
      style={style}
    >
      {editable && focused ? (
        <input
          className="relative z-10 w-full !min-w-0 border-none bg-transparent p-0 focus-visible:outline-none"
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
          className="relative z-10 flex items-center gap-2"
          onClick={() => {
            setFocused(true)
          }}
        >
          <div>{value}</div>
          {!!editable && <PencilIcon className="h-4 w-4 text-muted-foreground" />}
        </div>
      )}
    </div>
  )
}
