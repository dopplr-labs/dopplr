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
  configs: (InputConfig | SelectConfig | CheckboxConfig)[]
}

export type Group = {
  title: string
  subGroups: SubGroup[]
}

export const dummyData: Group[] = [
  {
    title: 'Text Editor',
    subGroups: [
      {
        title: 'Cursor',
        configs: [
          {
            type: ConfigType.SelectConfig,
            title: 'Cursor Blinking',
            description: 'Control the cursor animation style.',
            default: 'blink',
            options: [
              ['blink', 'blink'],
              ['smooth', 'smooth'],
              ['phase', 'phase'],
            ],
            key: 'cursor_1',
          },
          {
            type: ConfigType.CheckboxConfig,
            title: 'Cursor Smooth Caret Animation',
            description:
              'Controls whether the smooth caret animation should be enabled.',
            default: false,
            key: 'cursor_2',
          },
        ],
      },
      {
        title: 'Font',
        configs: [
          {
            type: ConfigType.InputConfig,
            title: 'Font Family',
            description: 'Controls the font family.',
            default:
              "FuraCode Nerd Font', 'monospace', monospace, 'Droid Sans Fallback'",
            key: 'cursor_3',
          },
          {
            type: ConfigType.InputConfig,
            title: 'Font Size',
            description: 'Controls the font size.',
            default: 16,
            key: 'cursor_4',
          },
        ],
      },
      {
        title: 'Minimap',
        configs: [
          {
            type: ConfigType.CheckboxConfig,
            title: 'Enabled',
            description: 'Controls whether the minimap is shown.',
            default: true,
            key: 'cursor_5',
          },
        ],
      },
    ],
  },
  {
    title: 'Work Bench',
    subGroups: [
      {
        title: 'Zen Mode',
        configs: [
          {
            type: ConfigType.CheckboxConfig,
            title: 'Center Layout',
            description:
              'Controls whether turning on Zen Mode also centers the layout.',
            default: true,
            key: 'cursor_6',
          },
          {
            type: ConfigType.CheckboxConfig,
            title: 'Full Screen',
            description:
              'Controls whether turning on Zen Mode also puts the workbench into fullscreen mode.',
            default: true,
            key: 'cursor_7',
          },
          {
            type: ConfigType.CheckboxConfig,
            title: 'Hide Line numbers',
            description:
              'Controls whether turning on Zen Mode also hides the editor line numbers.',
            default: true,
            key: 'cursor_8',
          },
          {
            type: ConfigType.CheckboxConfig,
            title: 'Hide Tabs',
            description:
              'Controls whether turning on Zen Mode also hides workbench tabs',
            default: true,
            key: 'cursor_9',
          },
        ],
      },
    ],
  },
]
