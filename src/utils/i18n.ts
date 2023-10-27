import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
// TODO: utils should not import anything from services, this file may need to be refactored into services.
import { LanuageType, appSettings } from '../services/AppSettings'

export type { LanuageType } from '../services/AppSettings'

const getDefaultLanguage = () => appSettings.defaultLanguage$.value
const setDefaultLanguage = appSettings.defaultLanguage$.next.bind(appSettings.defaultLanguage$)

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

i18n.on('languageChanged', lng => {
  if (lng === 'en' || lng === 'zh') {
    setDefaultLanguage(lng)
  } else {
    setDefaultLanguage('en')
  }
})

export const useCurrentLanguage = (): LanuageType => {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language
  if (currentLanguage !== 'en' && currentLanguage !== 'zh') {
    throw new Error('Not supported language')
  }
  return currentLanguage
}

export const useToggleLanguage = () => {
  const currentLanguage = useCurrentLanguage()

  return () => {
    if (currentLanguage === 'zh') {
      i18n.changeLanguage('en')
    } else {
      i18n.changeLanguage('zh')
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
