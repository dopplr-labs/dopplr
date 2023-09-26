'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { match } from 'ts-pattern'
import { cn } from '@/lib/utils'
import { Resource } from '@/db/schema/resource'

type NavLinkProps = LinkProps & {
  type: Resource['type']
  label: string
}

export default function NavLink({ label, type, href }: NavLinkProps) {
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
      <span className={cn('flex-1 text-sm', isActive ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
      <span
        className={cn(
          'rounded-full px-2 py-1 text-[10px] uppercase opacity-40 transition-opacity group-hover:opacity-100',
          isActive ? 'bg-background text-foreground' : 'bg-muted text-muted-foreground',
        )}
      >
        {match(type)
          .with('postgres', () => 'PG')
          .exhaustive()}
      </span>
    </Link>
  )
}
