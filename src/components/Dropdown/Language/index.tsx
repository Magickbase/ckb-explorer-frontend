import { TranslateFunction } from '../../../utils/i18n'
import { LanguagePanel } from './styled'
import SimpleButton from '../../SimpleButton'

export const languageText = (lan: LanuageType | null, t: TranslateFunction, reverse?: boolean) => {
  if (reverse) {
    return lan === 'zh' ? t('navbar.language_en') : t('navbar.language_zh')
  }
  return lan === 'en' ? t('navbar.language_en') : t('navbar.language_zh')
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
        {languageText(currentLanguage, t)}
      </SimpleButton>
      <div className="languageSeparate" />
      <SimpleButton className="languageNormal" onClick={handleLanguage}>
        {languageText(currentLanguage, i18n, true)}
      </SimpleButton>
    </LanguagePanel>
  )
}
