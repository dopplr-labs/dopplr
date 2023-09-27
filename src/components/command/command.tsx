'use client'

import { useTheme } from 'next-themes'
import { useHotkeys } from 'react-hotkeys-hook'
import { Palette, ZapIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { useStore } from '@/stores'

export default function Command() {
  const { setTheme, theme } = useTheme()
  const commandPalleteVisible = useStore((store) => store.commandPalleteVisible)
  const setCommandPalleteVisible = useStore((store) => store.setCommandPalleteVisible)
  const router = useRouter()

  useHotkeys('ctrl+k, meta+k', (e) => {
    e.preventDefault()
    setCommandPalleteVisible(true)
  })

  return (
    <CommandDialog open={commandPalleteVisible} onOpenChange={setCommandPalleteVisible}>
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
            <span>Switch to {theme === 'light' ? 'dark' : 'light'} mode</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push('/resources/new/postgres')
              setCommandPalleteVisible(false)
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
