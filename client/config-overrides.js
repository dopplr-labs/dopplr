const { override, addLessLoader, addPostcssPlugins } = require('customize-cra')
const tailwindUiColors = require('@tailwindcss/ui/colors')
const defaultTailwindConfig = require('tailwindcss/defaultTheme')
const tailwindConfig = require('./tailwind.config')

function remToPx(spacing) {
  const remValue = Number.parseFloat(spacing.replace('rem', ''))
  return `${remValue * 16}px`
}

module.exports = override(
  addLessLoader({
    lessOptions: {
      modifyVars: {
        '@font-family': tailwindConfig.theme.extend.fontFamily.sans.join(', '),
        '@primary-color': tailwindUiColors.blue['500'],
        '@border-radius-base': defaultTailwindConfig.borderRadius.default,
        '@font-size': defaultTailwindConfig.fontSize.base,
        '@font-size-sm': defaultTailwindConfig.fontSize.sm,
        '@height-base': remToPx(defaultTailwindConfig.spacing[10]),
        '@padding-sm': remToPx(defaultTailwindConfig.spacing[4]),
        '@heading-color': tailwindUiColors.gray['900'],
        '@text-color': tailwindUiColors.gray['500'],
      },
      javascriptEnabled: true,
    },
  }),
  addPostcssPlugins([
    require('tailwindcss')(require('./tailwind.config')),
    require('autoprefixer'),
  ]),
)
