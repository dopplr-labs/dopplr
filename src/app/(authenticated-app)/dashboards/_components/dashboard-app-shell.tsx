import Sidebar from '../../_components/sidebar'
import DashboardsList from './dashboards-list'

type DashboardAppShellProps = {
  children: React.ReactNode
}

export default function DashboardAppShell({ children }: DashboardAppShellProps) {
  return (
    <div className="flex h-full">
      <Sidebar className="w-[280px] overflow-auto border-r p-3">
        <DashboardsList />
      </Sidebar>
      <div className="flex-1">{children}</div>
    </div>
  )
}
