'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      themes={[
        'zinc',
        'zinc-dark',
        'red',
        'red-dark',
        'green',
        'green-dark',
        'blue',
        'blue-dark',
        'yellow',
        'yellow-dark',
        'violet',
        'violet-dark',
      ]}
      defaultTheme="green"
      storageKey="ui-theme"
    >
      {children}
    </NextThemesProvider>
  )
}
