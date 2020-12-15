import { Group, ConfigType } from 'types/settings'

export const textEditorSettings: Group = {
  title: 'Text Editor',
  subGroupDict: {
    cursor: {
      title: 'Cursor',
      description: 'Customize cursor settings.',
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
    font: {
      title: 'Font',
      description: 'Customize font settings.',
      configs: [
        {
          type: ConfigType.InputConfig,
          title: 'Font Family',
          description: 'Controls the font family.',
          default:
            "'FuraCode Nerd Font', 'monospace', monospace, 'Droid Sans Fallback'",
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
    minimap: {
      title: 'Minimap',
      description: 'Customize minimap settings.',
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
  },
}
