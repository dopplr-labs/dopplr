import dynamic from 'next/dynamic'
import { DatabaseZap, LayoutDashboard, Settings, Terminal } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

const ThemeToggle = dynamic(() => import('./theme-toggle'), { ssr: false })

const MENU_ITEMS = [
  {
    icon: <DatabaseZap />,
    label: 'Resources',
  },
  {
    icon: <Terminal />,
    label: 'Queries',
  },
  {
    icon: <LayoutDashboard />,
    label: 'Dashboards',
  },
  {
    icon: <Settings />,
    label: 'Settings',
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
          {MENU_ITEMS.map((item, index) => {
            return (
              <button
                className={cn(
                  'flex w-full flex-col items-center gap-2 rounded-md p-2.5',
                  index === 0 ? 'bg-muted' : undefined,
                )}
                key={item.label}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
        {children}
      </div>
    </div>
  )
}
