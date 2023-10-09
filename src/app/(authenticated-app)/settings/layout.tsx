import { PaletteIcon } from 'lucide-react'
import NavLink from './_components/nav-link'

type SettingsLayoutProps = {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex h-full">
      <div className="w-[280px] overflow-auto border-r p-3">
        <NavLink label="Appearance" href="/settings" icon={<PaletteIcon />} />
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
