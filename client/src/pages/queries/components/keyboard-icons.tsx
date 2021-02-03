import clsx from 'clsx'
import React from 'react'
import { capitalize } from 'lodash-es'

type KeyboardIconsProps = {
  keyMap: string
  className?: string
  style?: React.CSSProperties
}

export default function KeyboardIcons({
  keyMap,
  className,
  style,
}: KeyboardIconsProps) {
  const keys = keyMap.split('+')
  return (
    <div
      className={clsx('flex space-x-2 items-center', className)}
      style={style}
    >
      {keys.map((key, index) => (
        <React.Fragment key={`${key}-${index}`}>
          <div className="flex items-center justify-center w-10 h-8 font-mono font-medium border rounded text-xxs">
            {capitalize(key)}
          </div>
          {index !== keys.length - 1 ? <div>+</div> : null}
        </React.Fragment>
      ))}
    </div>
  )
}
