import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import js from '@eslint/js';

export default [
  {
    ignores: ['dist']
  },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'array-bracket-spacing': ['error', 'never'],
      'array-callback-return': ['error'],
      'block-scoped-var': ['error'],
      'block-spacing': ['error', 'always'],
      curly: ['error'],
      'dot-notation': ['error'],
      eqeqeq: ['error'],
      'no-console': ['warn'],
      'no-floating-decimal': ['error'],
      'no-implicit-coercion': ['error'],
      'no-implicit-globals': ['error'],
      'no-loop-func': ['error'],
      'no-return-assign': ['error'],
      'no-template-curly-in-string': ['error'],
      'no-unneeded-ternary': ['error'],
      'no-unused-vars': ['error', { args: 'none' }],
      'no-useless-computed-key': ['error'],
      'no-useless-return': ['error'],
      'no-var': ['error'],
      'prefer-const': ['error'],
      quotes: ['error', 'single'],
      semi: ['error', 'always']
    }
  }
];
