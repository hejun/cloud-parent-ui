require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    'vue/script-indent': ['error', 2, {baseIndent: 0, switchCase: 0, ignores: []}],
    'no-unused-vars': ['error'],
    'vue/multi-word-component-names': 'off'
  }
}
