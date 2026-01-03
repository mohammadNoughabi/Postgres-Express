// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores
  {
    ignores: ['dist/**'],
  },

  // Base recommended JS rules
  eslint.configs.recommended,

  // TypeScript type-checked rules (applies to .ts files automatically)
  ...tseslint.configs.recommendedTypeChecked,

  // Custom config with projectService
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js', '*.cjs', '*.mjs'], // Allows eslint.config.js and similar root configs
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      semi: 'error',
      // Add other custom rules here
    },
  },

  // Prettier last
  eslintConfigPrettier,
);
