import { Dashboard } from './dashboard'

export type Category = {
  id: number
  name: string
  dashboards?: Dashboard[]
}
