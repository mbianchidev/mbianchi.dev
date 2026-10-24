import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'tests/screenshots/**',
    ],
  },
  ...nextVitals,
]

export default eslintConfig
