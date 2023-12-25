import { PaletteIcon } from 'lucide-react'
import NavLink from './_components/nav-link'
import Sidebar from '../_components/sidebar'

type SettingsLayoutProps = {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex h-full">
      <Sidebar className="w-[280px] overflow-auto border-r p-3">
        <NavLink label="Appearance" href="/settings" icon={<PaletteIcon />} />
      </Sidebar>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
