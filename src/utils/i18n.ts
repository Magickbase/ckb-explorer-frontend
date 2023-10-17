import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import { storeCachedData, fetchCachedData } from './cache'
import { AppCachedKeys } from '../constants/cache'

export type LanuageType = 'en' | 'zh'

const getDefaultLanguage = () => fetchCachedData<LanuageType>(AppCachedKeys.AppLanguage) ?? 'en'
const setDefaultLanguage = (lng: LanuageType) => storeCachedData(AppCachedKeys.AppLanguage, lng)

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

i18n.on('languageChanged', (lng: LanuageType) => {
  setDefaultLanguage(lng)
})

export const useCurrentLanguage = (): LanuageType => {
  const { i18n } = useTranslation()
  return i18n.language as LanuageType
}

export const useToggleLanguage = () => {
  const currentLanguage = useCurrentLanguage()
  return () => {
    if (currentLanguage.indexOf('zh') === -1) {
      i18n.changeLanguage('zh')
    } else {
      i18n.changeLanguage('en')
    }
  }
}

export const useLanguageText = (payload?: { reverse: boolean }) => {
  const currentLanguage = useCurrentLanguage()
  const { t } = useTranslation()
  if (payload?.reverse) {
    return currentLanguage === 'zh' ? t('navbar.language_en') : t('navbar.language_zh')
  }
  return currentLanguage === 'en' ? t('navbar.language_en') : t('navbar.language_zh')
}

export const useOtherLanguageText = () => {
  return useLanguageText({ reverse: true })
}
