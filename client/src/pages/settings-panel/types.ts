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
  options: [string, string | number][]
  key: string
}

export type CheckboxConfig = {
  type: ConfigType.CHECKBOX
  title: string
  description: string
  default: boolean
  key: string
}

export type SubGroup = {
  title: string
  description: string
  configs: (InputConfig | SelectConfig | CheckboxConfig)[]
}

export type Group = {
  title: string
  subGroupDict: {
    [key: string]: SubGroup
  }
}
