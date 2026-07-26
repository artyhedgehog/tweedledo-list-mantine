import mantine from 'eslint-config-mantine';
import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

// @ts-check
export default defineConfig(
    tseslint.configs.recommended,
    ...mantine,
    { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            // Register the plugin with a namespace alias
            import: importPlugin,
        },
        rules: {
            // Enforce your absolute import preferences using the namespace alias
            'import/no-relative-parent-imports': 'error',
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        ['parent', 'sibling', 'index'],
                    ],
                },
            ],
        },
    },
    {
        files: ['**/*.story.tsx'],
        rules: {
            'no-console': 'off',
        },
    },
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: process.cwd(),
                project: ['./tsconfig.json'],
            },
        },
    },
    {
        files: ['**/*.{mjs,cjs,js,d.ts,d.mts}'],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                4,
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'none',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    }
);
