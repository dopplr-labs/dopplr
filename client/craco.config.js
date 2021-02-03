const CracoEsbuildPlugin = require('craco-esbuild')
const CracoLessPlugin = require('craco-less')
const defaultTailwindConfig = require('tailwindcss/defaultTheme')
const tailwindConfig = require('./tailwind.config')

function remToPx(spacing) {
  const remValue = Number.parseFloat(spacing.replace('rem', ''))
  return `${remValue * 16}px`
}

module.exports = {
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        esbuildLoaderOptions: {
          loader: 'tsx',
          target: 'es2015',
        },
      },
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@font-family': tailwindConfig.theme.extend.fontFamily.sans.join(
                ', ',
              ),
              '@primary-color':
                tailwindConfig.theme.extend.colors.brand.primary,
              '@border-radius-base': defaultTailwindConfig.borderRadius.DEFAULT,
              '@padding-sm': remToPx(defaultTailwindConfig.spacing[4]),
              '@heading-color':
                tailwindConfig.theme.extend.colors.content.primary,
              '@text-color':
                tailwindConfig.theme.extend.colors.content.secondary,
              '@text-color-secondary':
                tailwindConfig.theme.extend.colors.content.tertiary,
              '@form-item-label-font-size': defaultTailwindConfig.fontSize.xs,
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  style: {
    postcss: {
      plugins: [
        require('tailwindcss')(require('./tailwind.config')),
        require('autoprefixer'),
      ],
    },
  },
}
