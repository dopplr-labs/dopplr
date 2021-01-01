import { DefaultTextEditorSettings } from 'components/settings/default'
import { Group, ConfigType } from '../types'

export const textEditorSettings: Group = {
  title: 'Text Editor',
  subGroupDict: {
    basic: {
      title: 'Basic',
      description: 'Customize basic editor settings.',
      configs: [
        {
          type: ConfigType.SelectConfig,
          title: 'Line Numbers',
          description: 'Control the rendering of line numbers.',
          default: DefaultTextEditorSettings.lineNumbers as string,
          options: [
            ['on', 'on'],
            ['off', 'off'],
            ['relative', 'relative'],
            ['interval', 'interval'],
          ],
          key: 'lineNumbers',
        },
        {
          type: ConfigType.InputConfig,
          title: 'Line Height',
          description: 'Controls the line height.',
          default: DefaultTextEditorSettings.lineHeight as string,
          key: 'lineHeight',
        },
      ],
    },
    cursor: {
      title: 'Cursor',
      description: 'Customize cursor settings.',
      configs: [
        {
          type: ConfigType.SelectConfig,
          title: 'Cursor Blinking',
          description: 'Control the cursor animation style.',
          default: DefaultTextEditorSettings.cursorBlinking as string,
          options: [
            ['blink', 'blink'],
            ['smooth', 'smooth'],
            ['phase', 'phase'],
            ['expand', 'expand'],
            ['block-outline', 'solid'],
          ],
          key: 'cursorBlinking',
        },
        {
          type: ConfigType.CheckboxConfig,
          title: 'Cursor Smooth Caret Animation',
          description:
            'Controls whether the smooth caret animation should be enabled.',
          default: DefaultTextEditorSettings.cursorSmoothCaretAnimation as boolean,
          key: 'cursorSmoothCaretAnimation',
        },
        {
          type: ConfigType.SelectConfig,
          title: 'Cursor Style',
          description: 'Control the cursor style.',
          default: DefaultTextEditorSettings.cursorStyle as string,
          options: [
            ['line', 'line'],
            ['block', 'block'],
            ['underline', 'underline'],
            ['line-thin', 'line-thin'],
            ['block-outline', 'block-outline'],
            ['underline-thin', 'underline-thin'],
          ],
          key: 'cursorStyle',
        },
        {
          type: ConfigType.InputConfig,
          title: 'Cursor Surrounding Lines',
          description:
            'Controls the minimal number of visible leading and trailing lines surrounding the cursor.',
          default: DefaultTextEditorSettings.cursorSurroundingLines as number,
          key: 'cursorSurroundingLines',
        },
        {
          type: ConfigType.SelectConfig,
          title: 'Cursor Surrounding Lines Style',
          description:
            'Controls when Cursor Surrounding Lines should be enforced.',
          default: DefaultTextEditorSettings.cursorSurroundingLinesStyle as string,
          options: [
            ['default', 'default'],
            ['all', 'all'],
          ],
          key: 'cursorSurroundingLinesStyle',
        },
        {
          type: ConfigType.InputConfig,
          title: 'Cursor Width',
          description:
            'Control the width of the cursor when cursorStyle is set to line.',
          default: DefaultTextEditorSettings.cursorWidth as number,
          key: 'cursorWidth',
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
          default: DefaultTextEditorSettings.fontFamily as string,
          key: 'fontFamily',
        },
        {
          type: ConfigType.InputConfig,
          title: 'Font Size',
          description: 'Controls the font size.',
          default: DefaultTextEditorSettings.fontSize as number,
          key: 'fontSize',
        },
        {
          type: ConfigType.InputConfig,
          title: 'Font Weight',
          description: 'Controls the font size.',
          default: DefaultTextEditorSettings.fontWeight as number,
          key: 'fontWeight',
        },
        {
          type: ConfigType.CheckboxConfig,
          title: 'Enabled',
          description: 'Controls whether font ligature is used',
          default: DefaultTextEditorSettings.fontLigatures as boolean,
          key: 'fontLigatures',
        },
      ],
    },
  },
}
