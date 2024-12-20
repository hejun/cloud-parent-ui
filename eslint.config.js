import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
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
