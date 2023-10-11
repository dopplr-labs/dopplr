'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type NavLinkProps = LinkProps & {
  icon: React.ReactElement
  label: string
}

export default function NavLink({ icon, label, href }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href as string)

  return (
    <Link
      href={href}
      className={cn(
        'flex w-full flex-col items-center gap-2 rounded-md border p-2.5',
        isActive ? 'border-border bg-muted' : 'border-transparent',
      )}
    >
      {icon}
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </Link>
  )
}
