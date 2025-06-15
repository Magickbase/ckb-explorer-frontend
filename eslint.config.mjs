import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import unusedImports from 'eslint-plugin-unused-imports'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs['recommended-latest'],
  {
    plugins: {
      'unused-imports': unusedImports,
    },
  },
  eslintPluginPrettierRecommended,
)
