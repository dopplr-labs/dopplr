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
        '@primary-color': tailwindConfig.theme.extend.colors.brand.primary,
        '@border-radius-base': defaultTailwindConfig.borderRadius.DEFAULT,
        '@padding-sm': remToPx(defaultTailwindConfig.spacing[4]),
        '@heading-color': tailwindConfig.theme.extend.colors.content.primary,
        '@text-color': tailwindConfig.theme.extend.colors.content.secondary,
        '@text-color-secondary':
          tailwindConfig.theme.extend.colors.content.tertiary,
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
