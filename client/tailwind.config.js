const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const defaultConfig = require('tailwindcss/defaultConfig')

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },

  purge: {
    layers: ['components', 'utilities'],
    content: ['./src/**/*.tsx', './src/**/*.ts'],
  },

  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      borderColor: (theme) => ({
        default: theme('colors.gray.200'),
      }),
      colors: {
        gray: colors.blueGray,
        blue: colors.lightBlue,
      },
      fontSize: {
        xxs: '0.6rem',
      },
    },
  },

  variants: { ...defaultConfig.variants, visibility: ['group-hover'] },
}
