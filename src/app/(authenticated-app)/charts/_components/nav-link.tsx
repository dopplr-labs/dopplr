import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type NavLinkProps = LinkProps & {
  label: string
}

export default function NavLink({ label, href }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href as string)

  return (
    <Link
      href={href}
      className={cn(
        'group w-full rounded-md border px-2.5 py-1.5 block',
        isActive ? 'border-border bg-muted' : 'border-transparent',
      )}
    >
      <span className={cn('text-sm', isActive ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
    </Link>
  )
}
