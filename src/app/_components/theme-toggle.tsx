'use client'

import * as React from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

const THEME_ICON_MAP: Record<string, React.ReactElement> = {
  dark: <MoonIcon />,
  light: <SunIcon />,
}

export default function ThemeToggle() {
  const { setTheme, theme: activeTheme } = useTheme()

  return (
    <div className="space-y-2">
      <div>Mode</div>
      <div className="flex gap-2">
        {['dark', 'light'].map((theme) => (
          <Button
            key={theme}
            variant={activeTheme === theme ? 'default' : 'outline'}
            className="capitalize"
            icon={React.cloneElement(THEME_ICON_MAP[theme])}
            onClick={() => {
              setTheme(theme)
            }}
          >
            {theme}
          </Button>
        ))}
      </div>
    </div>
  )
}
