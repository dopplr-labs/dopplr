import React from 'react'
import clsx from 'clsx'

export default function ResourceCard({
  title,
  description,
  imagePath,
  comingSoon,
}: {
  title: string
  description: string
  imagePath: string
  comingSoon: boolean
}) {
  return (
    <div
      className={clsx(
        'group flex flex-col items-start justify-between relative p-4 border rounded-md overflow-hidden',
        comingSoon ? 'opacity-50' : 'hover:border-brand-primary cursor-pointer',
      )}
    >
      <img
        src={imagePath}
        alt="Postgres"
        className="object-contain object-left w-20 h-10 mb-4"
      />
      <p className="mb-1 text-sm font-medium">{title}</p>
      <p className="text-xs">{description}</p>

      {comingSoon ? (
        <span className="absolute top-0 right-0 mt-2 mr-4 text-xs">
          Coming Soon
        </span>
      ) : null}
    </div>
  )
}
