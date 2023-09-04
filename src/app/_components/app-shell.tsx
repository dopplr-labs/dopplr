import dynamic from 'next/dynamic'
import { DatabaseZapIcon, LayoutDashboardIcon, SettingsIcon, TerminalIcon } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import NavLink from '@/components/nav-link'

const ThemeToggle = dynamic(() => import('./theme-toggle'), { ssr: false })

const MENU_ITEMS = [
  {
    icon: <DatabaseZapIcon />,
    label: 'Resources',
    href: '/resources',
  },
  {
    icon: <TerminalIcon />,
    label: 'Queries',
    href: '/queries',
  },
  {
    icon: <LayoutDashboardIcon />,
    label: 'Dashboards',
    href: '/dashboards',
  },
  {
    icon: <SettingsIcon />,
    label: 'Settings',
    href: '/settings',
  },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <div className="h-14 border-b px-6">
        <div className="flex h-full items-center">
          <Logo className="mr-2 h-9 w-9" />
          <div className="text-xl font-bold tracking-tighter">Dopplr</div>
          <div className="flex-1" />
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex flex-col gap-3 border-r p-3">
          {MENU_ITEMS.map((item) => {
            return <NavLink icon={item.icon} label={item.label} href={item.href} key={item.href} />
          })}
        </div>
        {children}
      </div>
    </div>
  )
}
