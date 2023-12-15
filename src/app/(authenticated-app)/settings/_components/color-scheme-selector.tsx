'use client'

import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const COLOR_SCHEMES = [
  {
    label: 'Zinc',
    colorScheme: 'zinc',
  },
  {
    label: 'Red',
    colorScheme: 'red',
  },
  {
    label: 'Green',
    colorScheme: 'green',
  },
  {
    label: 'Blue',
    colorScheme: 'blue',
  },
  {
    label: 'Yellow',
    colorScheme: 'yellow',
  },
  {
    label: 'Violet',
    colorScheme: 'violet',
  },
]

type ColorSchemeSelectorProps = {
  className?: string
  style?: React.CSSProperties
}

export default function ColorSchemeSelector({ className, style }: ColorSchemeSelectorProps) {
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme?.endsWith('dark')
  const activeColorScheme = theme?.replace('-dark', '') ?? ''

  return (
    <div className={cn('grid max-w-screen-sm grid-cols-3 gap-4', className)} style={style}>
      {COLOR_SCHEMES.map((colorScheme) => {
        return (
          <Button
            key={colorScheme.colorScheme}
            variant="outline"
            icon={
              <div className={cn(isDarkMode ? `${colorScheme.colorScheme}-dark` : colorScheme.colorScheme, 'p-0.5')}>
                <div className="h-full w-full rounded-full bg-primary" />
              </div>
            }
            className={cn(
              'justify-start',
              colorScheme.colorScheme === activeColorScheme
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                : undefined,
            )}
            onClick={() => {
              setTheme(`${colorScheme.colorScheme}${isDarkMode ? '-dark' : ''}`)
            }}
            suppressHydrationWarning
          >
            {colorScheme.label}
          </Button>
        )
      })}
    </div>
  )
}
