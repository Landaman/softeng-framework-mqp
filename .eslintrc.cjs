require("@rushstack/eslint-patch/modern-module-resolution");

/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        "semi": "error",
        "no-empty": "warn",
        "no-empty-function": "warn",
        "prefer-const": "warn",
        "indent": ["warn", 4],
        "@typescript-eslint/no-empty-interface": "warn"
    }
};