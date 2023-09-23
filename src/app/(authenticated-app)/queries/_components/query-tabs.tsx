'use client'

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react'
import { DndContext, MouseSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import QueryTab from './query-tab'
import { useHasScroll } from '@/hooks/use-has-scroll'

type QueryTabsProps = {
  className?: string
  style?: React.CSSProperties
}

export default function QueryTabs({ className, style }: QueryTabsProps) {
  const [tabs, setTabs] = useState(['Query 1'])
  const [activeTab, setActiveTab] = useState(tabs[0])
  const { ref, hasScroll } = useHasScroll<HTMLDivElement>()

  useEffect(
    function scrollToLatestTab() {
      const element = document.getElementById(`query-tab-${tabs[tabs.length - 1]}`)
      element?.scrollIntoView()
    },
    [tabs],
  )

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  )

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ active, over }) => {
        const validationSchema = z.object({
          type: z.literal('query-tab'),
          tab: z.string(),
          index: z.number(),
        })
        const activeData = validationSchema.safeParse(active.data.current)
        const overData = validationSchema.safeParse(over?.data.current)
        if (activeData.success && overData.success) {
          setTabs((state) => arrayMove(state, activeData.data.index, overData.data.index))
          setActiveTab(activeData.data.tab)
        }
      }}
      modifiers={[restrictToHorizontalAxis]}
    >
      <SortableContext items={tabs} strategy={horizontalListSortingStrategy}>
        <div className={cn('flex items-end space-x-2 overflow-hidden px-2 pt-2.5', className)} style={style}>
          {hasScroll ? (
            <div
              className="flex flex-shrink-0 items-center justify-center rounded-t-md border border-b-0 p-1"
              onClick={() => {
                ref.current?.scrollBy({ left: -100, behavior: 'smooth' })
              }}
            >
              <Button size="icon-xs" icon={<ChevronLeftIcon />} variant="ghost" />
            </div>
          ) : null}
          <div className="query-tabs-container flex items-end space-x-2 overflow-x-auto overflow-y-hidden" ref={ref}>
            {tabs.map((tab, index) => {
              return (
                <QueryTab
                  index={index}
                  key={tab}
                  tab={tab}
                  onClose={() => {
                    setTabs((state) => state.filter((t) => t !== tab))
                  }}
                  active={tab === activeTab}
                  onSelect={() => {
                    setActiveTab(tab)
                  }}
                />
              )
            })}
          </div>
          {hasScroll ? (
            <div className="flex flex-shrink-0 items-center justify-center rounded-t-md border border-b-0 p-1">
              <Button
                size="icon-xs"
                icon={<ChevronRightIcon />}
                variant="ghost"
                onClick={() => {
                  ref.current?.scrollBy({ left: 100, behavior: 'smooth' })
                }}
              />
            </div>
          ) : null}
          <div className="flex flex-shrink-0 items-center justify-center rounded-t-md border border-b-0 p-1">
            <Button
              size="icon-xs"
              icon={<PlusIcon />}
              variant="ghost"
              onClick={() => {
                setTabs((state) => [...state, `Query ${Math.random().toString(16).slice(2, 6)}`])
              }}
            />
          </div>
        </div>
      </SortableContext>
    </DndContext>
  )
}
