export enum ConfigType {
  InputConfig = 1,
  SelectConfig,
  CheckboxConfig,
}

export type InputConfig = {
  type: ConfigType.InputConfig
  title: string
  description: string
  default: string | number
  key: string
}
export type SelectConfig = {
  type: ConfigType.SelectConfig
  title: string
  description: string
  default: string | number
  options: [string, string | number][]
  key: string
}
export type CheckboxConfig = {
  type: ConfigType.CheckboxConfig
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
