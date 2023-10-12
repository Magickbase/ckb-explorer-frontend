import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import { storeCachedData, fetchCachedData } from './cache'
import { AppCachedKeys } from '../constants/cache'

export type LanuageType = 'en' | 'zh'

export type I18nType = typeof i18n
export type TranslateFunction = typeof i18n.t

const getDefaultLanguage = () => fetchCachedData<LanuageType>(AppCachedKeys.AppLanguage) ?? 'en'

i18n.use(initReactI18next).init({
  resources: {
    en,
    zh,
  },
  fallbackLng: getDefaultLanguage(),
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', lan => {
  storeCachedData(AppCachedKeys.AppLanguage, lan)
})

export const useCurrentLanguage = (): LanuageType => {
  const { i18n } = useTranslation()
  return i18n.language as LanuageType
}

export const useToggleLanguage = () => {
  const currentLanguage = useCurrentLanguage()
  return () => {
    if (currentLanguage.indexOf('zh') !== -1) {
      i18n.changeLanguage('zh')
    } else {
      i18n.changeLanguage('en')
    }
    storeCachedData(AppCachedKeys.AppLanguage, currentLanguage)
  }
}
