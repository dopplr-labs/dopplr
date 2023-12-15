import colors from 'tailwindcss/colors'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type StatsCardConfig = {
  dataField: string
  nameField: string
  baseColor?: string
  unit?: string
}

type StatsCardProps = StatsCardConfig &
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string
    style?: React.CSSProperties
    data: any[]
  }

const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(({ className, style, data, ...config }, ref) => {
  return (
    <div className={cn('flex flex-col rounded-md border p-4', className)} style={style} ref={ref}>
      <div className="mb-2 flex items-center space-x-1">
        <div
          className="h-[10px] w-[10px] rounded-full"
          style={{
            background: config.baseColor ?? colors.blue['500'],
          }}
        />
        <span>{data?.[0]?.[config.nameField]}</span>
      </div>
      <div className="mb-1 font-mono text-5xl font-medium">
        {data?.[0]?.[config.dataField]} {config.unit}
      </div>
    </div>
  )
})

StatsCard.displayName = 'StatsCard'
export default StatsCard
