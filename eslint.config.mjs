import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'node_modules',
      'test-results',
      'playwright-report',
      'allure-results',
      'allure-report',
      '.auth',
      'site',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      'no-empty-pattern': 'off',
    },
  },
  {
    files: ['core/client/loadClient.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/tests/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='page'][callee.property.name='locator']",
          message: 'Define locators in page configs and use dynamicPage.getLocator().',
        },
        {
          selector: "CallExpression[callee.object.name='page'][callee.property.name='getByTestId']",
          message: 'Define locators in page configs and use dynamicPage.getLocator().',
        },
        {
          selector:
            "CallExpression[callee.property.name='waitForLoadState'][arguments.0.value='networkidle']",
          message: 'Wait on waitForResponse or element state instead of networkidle.',
        },
        {
          selector: "CallExpression[callee.property.name='waitForTimeout']",
          message: 'Wait on waitForResponse or element state instead of fixed timeouts.',
        },
      ],
    },
  },
);
