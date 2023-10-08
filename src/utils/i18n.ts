import { useState } from 'react'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import { storeCachedData, fetchCachedData } from './cache'
import { AppCachedKeys } from '../constants/cache'

export type LanuageType = 'en' | 'zh'

export type I18nType = typeof i18n

export type I18nInfoType = {
  i18n: I18nType
  currentLanguage: LanuageType
  setLanguage: (lan: LanuageType) => void
  toggleLanguage: () => void
}

const defaultLanguage = fetchCachedData<LanuageType>(AppCachedKeys.AppLanguage) ?? 'en'

i18n.use(initReactI18next).init({
  resources: {
    en,
    zh,
  },
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
})

export function useI18n(): I18nInfoType {
  const initialState = defaultLanguage
  const [stateLanguage, setStateLanguage] = useState(initialState)
  const { t } = useTranslation()

  const changeLanguage = (lan: LanuageType) => {
    if (lan.indexOf('zh') !== -1) {
      i18n.changeLanguage('zh')
    } else {
      i18n.changeLanguage('en')
    }
    storeCachedData(AppCachedKeys.AppLanguage, lan)
  }

  const setLanguage = (lan: LanuageType) => {
    setStateLanguage(lan)
    changeLanguage(lan)
  }

  return {
    i18n: { ...i18n, t },
    currentLanguage: stateLanguage,
    setLanguage,
    toggleLanguage: () => {
      if (stateLanguage === 'en') {
        setLanguage('zh')
      } else {
        setLanguage('en')
      }
    },
  }
}
