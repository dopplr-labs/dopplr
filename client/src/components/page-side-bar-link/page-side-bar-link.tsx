import clsx from 'clsx'
import React from 'react'
import { NavLink } from 'react-router-dom'

type PageSideBarLinkProps = {
  children: string
  badge?: string
  to: string
  className?: string
  style?: React.CSSProperties
}

export default function PageSideBarLink({
  children,
  badge,
  to,
  className,
  style,
}: PageSideBarLinkProps) {
  return (
    <NavLink
      to={to}
      className={clsx(
        'flex items-center justify-between px-4 py-2 space-x-4 text-xs',
        className,
      )}
      activeClassName="active-page-side-bar-link text-brand-primary hover:text-brand-primary"
      style={style}
    >
      <span className="flex-1 truncate">{children}</span>
      {badge ? (
        <span className="flex-shrink-0 px-2 uppercase rounded-full text-brand-primary text-xxs bg-brand-light">
          {badge}
        </span>
      ) : null}
    </NavLink>
  )
}
