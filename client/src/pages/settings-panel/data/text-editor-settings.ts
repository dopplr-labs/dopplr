import { DefaultTextEditorSettings } from 'components/settings/data/default-settings'
import { KeyBinding } from 'types/settings'
import { Group, ConfigType } from '../types'

export const textEditorSettings: Group = {
  title: 'Text Editor',
  subGroupDict: {
    basic: {
      title: 'Basic',
      description: 'Customize basic editor settings.',
      configs: [
        {
          type: ConfigType.CHECKBOX,
          title: 'Line Numbers',
          description: 'Control the rendering of line numbers.',
          default: true,
          key: 'lineNumbers',
        },
        {
          type: ConfigType.CHECKBOX,
          title: 'Word Wrap',
          description: 'Control the wrapping of the editor.',
          default: false,
          key: 'wordWrap',
        },
      ],
    },
    font: {
      title: 'Font',
      description: 'Customize font settings.',
      configs: [
        {
          type: ConfigType.INPUT,
          title: 'Font Family',
          description: 'Controls the font family.',
          default: DefaultTextEditorSettings.fontFamily as string,
          key: 'fontFamily',
        },
        {
          type: ConfigType.INPUT,
          title: 'Font Size',
          description: 'Controls the font size.',
          default: DefaultTextEditorSettings.fontSize as number,
          key: 'fontSize',
        },
        {
          type: ConfigType.INPUT,
          title: 'Line Height',
          description: 'Controls the line height.',
          default: DefaultTextEditorSettings.lineHeight,
          key: 'lineHeight',
        },
        {
          type: ConfigType.INPUT,
          title: 'Font Weight',
          description: 'Controls the font size.',
          default: DefaultTextEditorSettings.fontWeight,
          key: 'fontWeight',
        },
      ],
    },
    keybinding: {
      title: 'Key Bindings',
      description: 'Customize keybinding and keyboard shortcuts.',
      configs: [
        {
          type: ConfigType.SELECT,
          title: 'Custom Bindings',
          description: 'Controls the binding used by the editor',
          default: DefaultTextEditorSettings.keyBinding as string,
          options: [
            { key: 'None', value: KeyBinding.NONE },
            { key: 'Vim', value: KeyBinding.VIM },
            { key: 'Emacs', value: KeyBinding.EMACS },
            { key: 'VSCode', value: KeyBinding.VSCODE },
          ],
          key: 'keyBinding',
        },
      ],
    },
    theme: {
      title: 'Theme',
      description: 'Customize editor theme.',
      configs: [
        {
          type: ConfigType.SELECT,
          title: 'Theme',
          description: 'Controls the theme used by the editor',
          default: DefaultTextEditorSettings.theme as string,
          options: [
            {
              groupName: 'Light Theme',
              options: [
                {
                  key: 'Chrome',
                  value: 'chrome',
                },
                {
                  key: 'Clouds',
                  value: 'clouds',
                },
                {
                  key: 'Crimson Editor',
                  value: 'crimson_editor',
                },
                {
                  key: 'Dawn',
                  value: 'dawn',
                },
                {
                  key: 'Dreamweaver',
                  value: 'dreamweaver',
                },
                {
                  key: 'Eclipse',
                  value: 'eclipse',
                },
                {
                  key: 'GitHub',
                  value: 'github',
                },
                {
                  key: 'IPlastic',
                  value: 'iplastic',
                },
                {
                  key: 'Solarized Light',
                  value: 'solarized_light',
                },
                {
                  key: 'TextMate',
                  value: 'textmate',
                },
                {
                  key: 'Tomorrow',
                  value: 'tomorrow',
                },
                {
                  key: 'Xcode',
                  value: 'xcode',
                },
                {
                  key: 'Kuroir',
                  value: 'kuroir',
                },
                {
                  key: 'KatzenMilch',
                  value: 'katzenmilch',
                },
                {
                  key: 'SQL Server',
                  value: 'sqlserver',
                },
              ],
            },
            {
              groupName: 'Dark Theme',
              options: [
                {
                  key: 'Ambiance',
                  value: 'ambiance',
                },
                {
                  key: 'Chaos',
                  value: 'chaos',
                },
                {
                  key: 'Clouds Midnight',
                  value: 'clouds_midnight',
                },
                {
                  key: 'Dracula',
                  value: 'dracula',
                },
                {
                  key: 'Cobalt',
                  value: 'cobalt',
                },
                {
                  key: 'Gruvbox',
                  value: 'gruvbox',
                },
                {
                  key: 'Green on Black',
                  value: 'gob',
                },
                {
                  key: 'idle Fingers',
                  value: 'idle_fingers',
                },
                {
                  key: 'krTheme',
                  value: 'kr_theme',
                },
                {
                  key: 'Merbivore',
                  value: 'merbivore',
                },
                {
                  key: 'Merbivore Soft',
                  value: 'merbivore_soft',
                },
                {
                  key: 'Mono Industrial',
                  value: 'mono_industrial',
                },
                {
                  key: 'Monokai',
                  value: 'monokai',
                },
                {
                  key: 'Nord Dark',
                  value: 'nord_dark',
                },
                {
                  key: 'Pastel on dark',
                  value: 'pastel_on_dark',
                },
                {
                  key: 'Solarized Dark',
                  value: 'solarized_dark',
                },
                {
                  key: 'Terminal',
                  value: 'terminal',
                },
                {
                  key: 'Tomorrow Night',
                  value: 'tomorrow_night',
                },
                {
                  key: 'Tomorrow Night Blue',
                  value: 'tomorrow_night_blue',
                },
                {
                  key: 'Tomorrow Night Bright',
                  value: 'tomorrow_night_bright',
                },
                {
                  key: 'Tomorrow Night 80s',
                  value: 'tomorrow_night_eighties',
                },
                {
                  key: 'Twilight',
                  value: 'twilight',
                },
                {
                  key: 'Vibrant Ink',
                  value: 'vibrant_ink',
                },
              ],
            },
          ],
          key: 'theme',
        },
      ],
    },
  },
}
