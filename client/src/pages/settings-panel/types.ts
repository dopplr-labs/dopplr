export enum ConfigType {
  INPUT = 'INPUT',
  SELECT = 'SELECT',
  CHECKBOX = 'CHECKBOX',
}

export type InputConfig = {
  type: ConfigType.INPUT
  title: string
  description: string
  default: string | number
  key: string
}

export type SelectConfig = {
  type: ConfigType.SELECT
  title: string
  description: string
  default: string | number
  options: {
    key: string // shown in UI
    value: string | number // actual value used
  }[]
  key: string
}

export type CheckboxConfig = {
  type: ConfigType.CHECKBOX
  title: string
  description: string
  default: boolean
  key: string
}

// collection of logically related settings items
export type SubGroup = {
  title: string
  description: string
  configs: (InputConfig | SelectConfig | CheckboxConfig)[]
}

// collection of smaller groups of settings
export type Group = {
  title: string
  subGroupDict: {
    [key: string]: SubGroup
  }
}
