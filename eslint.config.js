import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: globals.browser, parser: pluginVue, parserOptions: { parser: tseslint.parser } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  eslintConfigPrettier,
  eslintPluginPrettier,
  {
    rules: {
      'vue/script-indent': ['error', 2, { baseIndent: 0, switchCase: 0, ignores: [] }],
      'vue/multi-word-component-names': 'off',
      'comma-dangle': 'error',
      'comma-spacing': 'error',
      'no-unused-vars': 'error',
      'no-var': 'error',
      'no-debugger': 'warn',
      'no-console': 'warn',
      'no-alert': 'warn'
    }
  }
]
