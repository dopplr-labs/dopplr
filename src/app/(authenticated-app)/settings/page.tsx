import dynamic from 'next/dynamic'
const ThemeToggle = dynamic(() => import('@/app/_components/theme-toggle'), { ssr: false })

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-2xl font-bold">Theme</div>
          <div className="text-sm text-muted-foreground">Update theme preferences</div>
        </div>
        <div className="col-span-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
