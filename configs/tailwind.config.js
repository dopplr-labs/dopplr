const defaultTheme = require('tailwindcss/defaultTheme')
const defaultConfig = require('tailwindcss/defaultConfig')
const tailwindUI = require('@tailwindcss/ui')

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },

  // purge: [
  //   path.resolve(__dirname, '../src/**/*.tsx'),
  //   path.resolve(__dirname, '../src/**/*.ts'),
  // ],

  // TODO: Purge CSS files once theming is done in the @tail-kit/tail-kit
  purge: false,

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
