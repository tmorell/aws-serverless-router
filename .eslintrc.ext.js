module.exports = {

    "rules": {
        "@typescript-eslint/array-type": [
            "error",
            {
                "default": "generic",
            },
        ],
        "@typescript-eslint/ban-tslint-comment": "error",
        "@typescript-eslint/brace-style": "error",
        "@typescript-eslint/comma-spacing": "error",
        "@typescript-eslint/consistent-indexed-object-style": "error",
        "@typescript-eslint/consistent-type-assertions": [
            "error",
            {
                "assertionStyle": "angle-bracket",
            },
        ],
        "@typescript-eslint/default-param-last": "error",
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
                "allowTypedFunctionExpressions": false,
                "allowHigherOrderFunctions": false,
                "allowDirectConstAssertionInArrowFunctions": false
            }
        ],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                "accessibility": "no-public",
            },
        ],
        "@typescript-eslint/indent": "error",
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                },
            },
        ],
        "@typescript-eslint/no-confusing-non-null-assertion": "error",
        "@typescript-eslint/no-dupe-class-members": "error",
        "@typescript-eslint/no-duplicate-imports": "error",
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/no-extra-parens": "error",
        "@typescript-eslint/no-extraneous-class": [
            "error",
            {
                "allowStaticOnly": true,
            },
        ],
        "@typescript-eslint/no-implicit-any-catch": "error",
        "@typescript-eslint/no-invalid-this": "error",
        "@typescript-eslint/no-invalid-void-type": "error",
        "@typescript-eslint/no-loop-func": "error",
        "@typescript-eslint/no-loss-of-precision": "error",
        "@typescript-eslint/no-redeclare": "error",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-useless-constructor": "error",
        "@typescript-eslint/prefer-enum-initializers": "error",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/prefer-literal-enum-member": "error",
        "@typescript-eslint/quotes": "error",
        "@typescript-eslint/semi": "error",
        "@typescript-eslint/unified-signatures": "error",
        "comma-dangle": ["error", "always-multiline"],
        "eqeqeq": "error",
        "function-paren-newline": ["error", "consistent"],
        "jest/no-focused-tests": "error",
        "key-spacing": "error",
        "keyword-spacing": [
            "error",
            {
                "overrides": {
                    "this": { "before": false }
                }
            }
        ],
        "linebreak-style": ["error", "unix"],
        "max-classes-per-file": "error",
        "no-await-in-loop": "error",
        "no-console": "error",
        "no-loss-of-precision": "error",
        "no-mixed-spaces-and-tabs": "error",
        "no-multi-spaces": "error",
        "no-promise-executor-return": "error",
        "no-tabs": "error",
        "no-template-curly-in-string": "error",
        "no-trailing-spaces": "error",
        "no-unreachable-loop": "error",
        "no-useless-backreference": "error",
        "no-return-await": "error",
        "no-whitespace-before-property": "error",
        "no-async-promise-executor": "error",
        "object-curly-spacing": [
            "error",
            "always",
        ],
        "padded-blocks": ["error", "never"],
        "quotes": ["error", "double"],
        "require-atomic-updates": "error",
        "require-await": "error",
        "rest-spread-spacing": ["error", "never"],
        "semi": "error",
        "semi-spacing": "error",
        "semi-style": ["error", "last"],
        "space-before-blocks": "error",
        "space-in-parens": ["error", "never"],
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "strict": "error",
        "switch-colon-spacing": "error",
        "template-curly-spacing": "error",
        "template-tag-spacing": ["error", "always"],
    },

};