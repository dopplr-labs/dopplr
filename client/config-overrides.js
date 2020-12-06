const {
  override,
  addLessLoader,
  addPostcssPlugins,
  addWebpackAlias,
  addWebpackPlugin,
} = require('customize-cra')
const defaultTailwindConfig = require('tailwindcss/defaultTheme')
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin')
const tailwindConfig = require('./tailwind.config')

function remToPx(spacing) {
  const remValue = Number.parseFloat(spacing.replace('rem', ''))
  return `${remValue * 16}px`
}

module.exports = override(
  addWebpackAlias({
    vscode: require.resolve('monaco-languageclient/lib/vscode-compatibility'),
  }),

  addWebpackPlugin(
    new MonacoEditorWebpackPlugin({
      languages: ['sql', 'pgsql'],
    }),
  ),

  addLessLoader({
    lessOptions: {
      modifyVars: {
        '@font-family': tailwindConfig.theme.extend.fontFamily.sans.join(', '),
        '@primary-color': tailwindConfig.theme.extend.colors.blue['500'],
        '@border-radius-base': defaultTailwindConfig.borderRadius.default,
        '@padding-sm': remToPx(defaultTailwindConfig.spacing[4]),
        '@heading-color': tailwindConfig.theme.extend.colors.gray['800'],
        '@text-color': tailwindConfig.theme.extend.colors.gray['600'],
        '@text-color-secondary': tailwindConfig.theme.extend.colors.gray['400'],
        '@form-item-label-font-size': defaultTailwindConfig.fontSize.xs,
      },
      javascriptEnabled: true,
    },
  }),

  addPostcssPlugins([
    require('tailwindcss')(require('./tailwind.config')),
    require('autoprefixer'),
  ]),
)
