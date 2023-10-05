'use client'

import * as React from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

const THEME_ICON_MAP: Record<string, React.ReactElement> = {
  dark: <MoonIcon />,
  light: <SunIcon />,
}

const ADDITIONAL_THEMES: Record<string, string> = {
  slate: '#FAFAFA',
  red: '#E11D48',
  blue: '#3B82F6',
  green: '#22C55E',
  orange: '#EA580C',
}

export default function ThemeToggle() {
  const { setTheme, theme: activeTheme } = useTheme()

  return (
    <div className="space-y-4">
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

      <div className="flex gap-2">
        {Object.entries(ADDITIONAL_THEMES).map(([theme, color]) => (
          <div
            key={theme}
            className="h-8 w-8 cursor-pointer rounded-full"
            style={{ background: color }}
            onClick={() => {
              setTheme(`${activeTheme}`)
            }}
          />
        ))}
      </div>
    </div>
  )
}
