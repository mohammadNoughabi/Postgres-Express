import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Allow parameters starting with underscore
          varsIgnorePattern: '^_', // Allow variables starting with underscore
        },
      ],
    },
  },
);
