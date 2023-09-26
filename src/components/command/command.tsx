'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Palette, ZapIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'

export default function Command() {
  const { setTheme, theme } = useTheme()
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const router = useRouter()

  useHotkeys('ctrl+k', (e) => {
    e.preventDefault()
    setIsCommandOpen(true)
  })

  return (
    <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
      <CommandInput placeholder="Type a command or search..." />

      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>

        <CommandGroup heading="Basic Commands">
          <CommandItem
            onSelect={() => {
              setTheme(theme === 'light' ? 'dark' : 'light')
            }}
          >
            <Palette className="mr-2 h-4 w-4" />
            <span>Change Theme</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push('/resources/new/postgres')
              setIsCommandOpen(false)
            }}
          >
            <ZapIcon className="mr-2 h-4 w-4" />
            <span>Create Postgres Resource</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
