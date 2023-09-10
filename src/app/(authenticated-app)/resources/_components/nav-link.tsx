'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { cloneElement } from 'react'
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
      className={cn('flex w-full items-center gap-2 rounded-md p-2.5', isActive ? 'bg-muted' : undefined)}
    >
      {cloneElement(icon, { className: 'w-5 h-5' })}
      <span className={cn('text-sm', isActive ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
    </Link>
  )
}
