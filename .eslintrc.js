/** @type {import('eslint').Linter.Config} */
const config = {
  env: {
    browser: true,
    node: true,
  },
  globals: {},
  extends: [
    'plugin:react/recommended',
    'standard',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'plugin:@next/next/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: '16.14.0',
    },
  },
  rules: {
    'no-undef': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    camelcase: 'off',
    'comma-dangle': 'off',
    'func-call-spacing': 'off',
    'import/no-absolute-path': 'off',
    'import/order': ['error', { groups: ['builtin', 'external', 'internal'] }],
    'import/un-resolved': 'off',
    indent: 'off',
    'multiline-ternary': 'off',
    'no-console': 'warn',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'no-useless-escape': 'off',
    'prefer-regex-literals': 'off',
    'react/no-unknown-property': 'error',
    'react/prop-types': 'off',
    'react/self-closing-comp': ['error', { component: true, html: true }],
    'react/react-in-jsx-scope': 'off',
    'space-before-function-paren': 'off',
  },
}

module.exports = config
