require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: { es2020: true },
  extends: [
    '../.eslintrc.cjs'
  ],
  parserOptions: { ecmaVersion: 'ESNext'},
}
