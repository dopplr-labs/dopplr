'use client'

import {
  ArrowRight,
  BarChartHorizontalBigIcon,
  DatabaseZapIcon,
  LayoutDashboardIcon,
  MailIcon,
  SettingsIcon,
  TerminalIcon,
} from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import NavLink from './nav-link'
import AccountMenu from './account-menu'
import { Button } from '@/components/ui/button'
import { useStore } from '@/stores'

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
    icon: <BarChartHorizontalBigIcon />,
    label: 'Charts',
    href: '/charts',
  },
  {
    icon: <LayoutDashboardIcon />,
    label: 'Dashboards',
    href: '/dashboards',
  },
  {
    icon: <MailIcon />,
    label: 'Invites',
    href: '/invites',
  },
  {
    icon: <SettingsIcon />,
    label: 'Settings',
    href: '/settings',
  },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarVisible = useStore((store) => store.sidebarVisible)
  const setSidebarVisible = useStore((store) => store.setSidebarVisible)

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
        </div>
      </div>
      <div className="relative flex flex-1 overflow-hidden">
        <div className="sticky left-0 top-0 flex flex-shrink-0 flex-col justify-between gap-3 overflow-auto border-r p-3">
          <div className="flex flex-col gap-3">
            {MENU_ITEMS.map((item) => {
              return <NavLink icon={item.icon} label={item.label} href={item.href} key={item.href} />
            })}
          </div>
          {!sidebarVisible && (
            <Button
              icon={<ArrowRight />}
              variant="ghost"
              onClick={() => {
                setSidebarVisible(true)
              }}
            />
          )}
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
