import { I18nType, LanuageType, useI18n } from '../../../utils/i18n'
import { LanguagePanel } from './styled'
import SimpleButton from '../../SimpleButton'

export const languageText = (lan: LanuageType | null, i18n: I18nType, reverse?: boolean) => {
  if (reverse) {
    return lan === 'zh' ? i18n.t('navbar.language_en') : i18n.t('navbar.language_zh')
  }
  return lan === 'en' ? i18n.t('navbar.language_en') : i18n.t('navbar.language_zh')
}

export default ({ setShow, left, top }: { setShow: Function; left: number; top: number }) => {
  const { toggleLanguage, currentLanguage, i18n } = useI18n()
  const hideDropdown = () => {
    setShow(false)
  }
  const handleLanguage = () => {
    hideDropdown()
    toggleLanguage()
  }
  return (
    <LanguagePanel left={left} top={top} onMouseLeave={hideDropdown}>
      <SimpleButton className="languageSelected" onClick={hideDropdown}>
        {languageText(currentLanguage, i18n)}
      </SimpleButton>
      <div className="languageSeparate" />
      <SimpleButton className="languageNormal" onClick={handleLanguage}>
        {languageText(currentLanguage, i18n, true)}
      </SimpleButton>
    </LanguagePanel>
  )
}
