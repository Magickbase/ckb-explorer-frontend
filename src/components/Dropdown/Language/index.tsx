import { useTranslation } from 'react-i18next'
import { useCurrentLanguage, useToggleLanguage } from '../../../utils/i18n'
import { LanguagePanel } from './styled'
import SimpleButton from '../../SimpleButton'

export const useLanguageText = (reverse?: boolean) => {
  const lan = useCurrentLanguage()
  const { t } = useTranslation()
  if (reverse) {
    return lan === 'zh' ? t('navbar.language_en') : t('navbar.language_zh')
  }
  return lan === 'en' ? t('navbar.language_en') : t('navbar.language_zh')
}

export default ({ setShow, left, top }: { setShow: Function; left: number; top: number }) => {
  const toggleLanguage = useToggleLanguage()
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
        {useLanguageText()}
      </SimpleButton>
      <div className="languageSeparate" />
      <SimpleButton className="languageNormal" onClick={handleLanguage}>
        {useLanguageText(true)}
      </SimpleButton>
    </LanguagePanel>
  )
}
