import { Group, ConfigType } from 'types/settings'

export const workbenchSettings: Group = {
  title: 'Workbench',
  subGroupDict: {
    zenMode: {
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
  },
}
