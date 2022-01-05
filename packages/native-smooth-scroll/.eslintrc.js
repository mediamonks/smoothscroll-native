module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['@mediamonks/eslint-config-base'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.ts', '**/*.stories.ts', '**/test-utils/**/*.ts'] },
    ],
  },
  overrides: [
    {
      files: '**/*.stories.ts',
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['strictCamelCase', 'UPPER_CASE', 'StrictPascalCase'],
          },
        ],
      },
    },
  ],
};
