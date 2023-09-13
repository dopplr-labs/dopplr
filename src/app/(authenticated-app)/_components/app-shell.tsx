import dynamic from 'next/dynamic'
import { DatabaseZapIcon, LayoutDashboardIcon, SettingsIcon, TerminalIcon } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import NavLink from './nav-link'
import AccountMenu from './account-menu'

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
      <div className="h-14 flex-shrink-0 border-b bg-background px-6">
        <div className="flex h-full items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-9 w-9" />
            <div className="font-mono text-xl font-bold">Dopplr</div>
          </Link>
          <div className="flex-1" />
          <AccountMenu />
          <ThemeToggle />
        </div>
      </div>
      <div className="relative flex flex-1 overflow-hidden">
        <div className="sticky left-0 top-0 flex flex-shrink-0 flex-col gap-3 overflow-auto border-r p-3">
          {MENU_ITEMS.map((item) => {
            return <NavLink icon={item.icon} label={item.label} href={item.href} key={item.href} />
          })}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
