'use client'

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react'
import { DndContext, MouseSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { z } from 'zod'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn, generateRandomId } from '@/lib/utils'
import QueryTab from './query-tab'
import { useHasScroll } from '@/hooks/use-has-scroll'
import { useStore } from '@/stores'
import { trpc } from '@/lib/trpc/client'

type QueryTabsProps = {
  className?: string
  style?: React.CSSProperties
}

export default function QueryTabs({ className, style }: QueryTabsProps) {
  const getResourcesQuery = trpc.resource.getResources.useQuery()

  const queryTabsOrder = useStore((store) => store.queryTabsOrder)
  const updateQueryTabsOrder = useStore((store) => store.updateQueryTabsOrder)
  const closeQueryTab = useStore((store) => store.closeQueryTab)
  const addQueryTab = useStore((store) => store.addQueryTab)
  const activeQueryTabId = useStore((store) => store.activeQueryTabId)
  const setActiveQueryTabId = useStore((store) => store.setActiveQueryTabId)

  const { ref, hasScroll } = useHasScroll<HTMLDivElement>()

  useEffect(
    function scrollToActiveTab() {
      const element = document.getElementById(`query-tab-${activeQueryTabId}`)
      element?.scrollIntoView()
    },
    [activeQueryTabId],
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
          updateQueryTabsOrder(activeData.data.index, overData.data.index)
          setActiveQueryTabId(activeData.data.tab)
        }
      }}
      modifiers={[restrictToHorizontalAxis]}
    >
      <SortableContext items={queryTabsOrder} strategy={horizontalListSortingStrategy}>
        <div className={cn('flex items-end space-x-2 overflow-hidden px-2 pt-[15px]', className)} style={style}>
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
            {queryTabsOrder.map((tabId, index) => {
              return (
                <QueryTab
                  index={index}
                  key={tabId}
                  tab={tabId}
                  onClose={() => {
                    closeQueryTab(tabId)
                  }}
                  active={tabId === activeQueryTabId}
                  onSelect={() => {
                    setActiveQueryTabId(tabId)
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
                if (getResourcesQuery.data?.[0]) {
                  const tabId = generateRandomId(16)
                  addQueryTab(tabId, getResourcesQuery.data?.[0].id)
                }
              }}
            />
          </div>
        </div>
      </SortableContext>
    </DndContext>
  )
}
