import { isEqual } from 'lodash-es'
import { TabData } from '../types'

export function isTabUnsaved(
  tabData: Partial<TabData>,
  originalTabData?: TabData,
): boolean {
  return originalTabData ? !isEqual(tabData, originalTabData) : false
}
