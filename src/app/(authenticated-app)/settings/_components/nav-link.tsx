'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { cloneElement } from 'react'
import { cn } from '@/lib/utils'

type NavLinkProps = LinkProps & {
  label: string
  icon?: React.ReactElement
}

export default function NavLink({ label, icon, href }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href as string)

  return (
    <Link
      href={href}
      className={cn(
        'group flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5',
        isActive ? 'border-border bg-muted' : 'border-transparent',
      )}
    >
      {icon ? cloneElement(icon, { className: 'h-4 w-4' }) : null}
      <span className={cn('flex-1 text-sm', isActive ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
    </Link>
  )
}
