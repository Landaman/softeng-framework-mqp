require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    '../.eslintrc.cjs',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'ESNext', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
}
