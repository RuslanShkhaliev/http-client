module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'airbnb-base',
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        'import-newlines',
        '@typescript-eslint',
    ],
    rules: {
        'brace-style': ['error', '1tbs', {
            allowSingleLine: false,
        }],
        camelcase: 'warn',
        'class-methods-use-this': 'off',
        'consistent-return': 'off',
        curly: ['error', 'all'],
        'default-case': 'off',
        indent: ['error', 4, {
            SwitchCase: 1,
        }],
        'max-len': 'off',
        'no-console': 'error',
        'no-param-reassign': 'off',
        'no-plusplus': 'off',
        'no-redeclare': 'off',
        'no-restricted-syntax': [
            'error',
            'ForInStatement',
            'LabeledStatement',
            'WithStatement',
        ],
        'no-script-url': 'warn',
        '@typescript-eslint/no-var-requires': 'off',
        'no-undef': 'off',
        'no-shadow': 'off',
        'no-shadow-restricted-names': 'warn',
        'no-useless-concat': 'off',
        'no-unused-vars': 'off',
        'object-curly-spacing': ['error', 'never'],
        'object-shorthand': ['error', 'always', {
            avoidQuotes: false,
        }],
        'padding-line-between-statements': 'off',
        'prefer-template': 'off',
        'sort-imports': ['error', {
            ignoreDeclarationSort: true,
        }],
        /** Описание внутри Symbol попадает в prod сборку */
        'symbol-description': 'off',
        'no-await-in-loop': 'off',
        'node/no-callback-literal': 'off',

        'import/no-dynamic-require': 'off',
        'import/prefer-default-export': 'off',

        'import/extensions': 'off',
        'import/no-unresolved': 'off',

        'import-newlines/enforce': ['error', {
            items: 2,
            'max-len': 1000,
            semi: true,
        }],
        '@typescript-eslint/member-delimiter-style': ['error', {
            multiline: {
                delimiter: 'none',
                requireLast: true,
            },
            singleline: {
                delimiter: 'semi',
                requireLast: false,
            },
            multilineDetection: 'brackets',
        }],
        '@typescript-eslint/no-shadow': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: ['interface', 'type'],
            },
            {
                blankLine: 'always',
                prev: '*',
                next: 'return',
            },
            {
                blankLine: 'always',
                prev: ['const', 'let', 'var'],
                next: '*',
            },
            {
                blankLine: 'any',
                prev: ['const', 'let', 'var', 'type'],
                next: ['const', 'let', 'var', 'type'],
            },
        ],
        '@typescript-eslint/space-infix-ops': ['error', {
            int32Hint: false,
        }],
        '@typescript-eslint/type-annotation-spacing': ['error', {
            before: false,
            after: true,
            overrides: {
                arrow: {
                    before: true,
                    after: true,
                },
            },
        }],
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'no-use-before-define': 'off',
                '@typescript-eslint/ban-ts-comment': 'off',
                'linebreak-style': 'off',
            },
        },
    ],
    globals: {
        globalThis: true,
        google: true,
    },
};
