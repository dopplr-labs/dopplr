const path = require('path')
const defaultTheme = require('tailwindcss/defaultTheme')
const defaultConfig = require('tailwindcss/defaultConfig')
const tailwindUI = require('@tailwindcss/ui')

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },

  purge: [
    path.resolve(__dirname, '../src/**/*.tsx'),
    path.resolve(__dirname, '../src/**/*.ts'),
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans HK', ...defaultTheme.fontFamily.sans],
        mono: ['Fira Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },

  variants: defaultConfig.variants,

  plugins: [tailwindUI],
}
