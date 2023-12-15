import dynamic from 'next/dynamic'
import ThemeToggle from './_components/theme-toggle'

const ColorSchemeSelector = dynamic(() => import('./_components/color-scheme-selector'), { ssr: false })

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="text-xl font-medium text-foreground">Theme Preference</div>
      <div className="mb-6 text-sm text-muted-foreground">Choose your preferred editor theme</div>

      <div className="text-sm">Dark Mode</div>
      <div className="mb-4 text-sm text-muted-foreground">
        Toggle the interface for a comfortable night-time viewing experience.
      </div>
      <ThemeToggle className="mb-8" />
      <div className="text-sm">Color Scheme</div>
      <div className="mb-4 text-sm text-muted-foreground">Pick a color scheme to tailor your editor&apos;s look.</div>
      <ColorSchemeSelector />
    </div>
  )
}
