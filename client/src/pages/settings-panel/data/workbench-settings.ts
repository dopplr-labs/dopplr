import { DefaultWorkbenchSettings } from 'components/settings/default'
import { Group, ConfigType } from '../types'

export const workbenchSettings: Group = {
  title: 'Workbench',
  subGroupDict: {
    zenMode: {
      title: 'Zen Mode',
      description: 'Customize zen mode settings.',
      configs: [
        {
          type: ConfigType.CheckboxConfig,
          title: 'Center Layout',
          description:
            'Controls whether turning on Zen Mode also centers the layout.',
          default: DefaultWorkbenchSettings.zenCenterLayout as boolean,
          key: 'zenCenterLayout',
        },
        {
          type: ConfigType.CheckboxConfig,
          title: 'Full Screen',
          description:
            'Controls whether turning on Zen Mode also puts the workbench into fullscreen mode.',
          default: DefaultWorkbenchSettings.zenFullScreen as boolean,
          key: 'zenFullScreen',
        },
        {
          type: ConfigType.CheckboxConfig,
          title: 'Hide Line numbers',
          description:
            'Controls whether turning on Zen Mode also hides the editor line numbers.',
          default: DefaultWorkbenchSettings.zenHideLineNumber as boolean,
          key: 'zenHideLineNumber',
        },
        {
          type: ConfigType.CheckboxConfig,
          title: 'Hide Tabs',
          description:
            'Controls whether turning on Zen Mode also hides workbench tabs',
          default: DefaultWorkbenchSettings.zenHideTabs as boolean,
          key: 'zenHideTabs',
        },
      ],
    },
  },
}
