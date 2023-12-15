'use client'

import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
  style?: React.CSSProperties
}

export default function ThemeToggle({ className, style }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme?.endsWith('dark')
  const colorScheme = theme?.replace('-dark', '') ?? ''

  return (
    <div className={cn('flex items-center space-x-4', className)} style={style}>
      <Button
        variant={!isDarkMode ? 'default' : 'outline'}
        icon={<SunIcon />}
        onClick={() => {
          setTheme(colorScheme)
        }}
      >
        Light Mode
      </Button>
      <Button
        variant={isDarkMode ? 'default' : 'outline'}
        icon={<MoonIcon />}
        onClick={() => {
          setTheme(`${colorScheme}-dark`)
        }}
      >
        Dark Mode
      </Button>
    </div>
  )
}
