import { useState, useLayoutEffect, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { HeaderLanguagePanel, MobileSubMenuPanel } from './styled'
import SimpleButton from '../../SimpleButton'
import WhiteDropdownIcon from '../../../assets/white_dropdown.png'
import WhiteDropUpIcon from '../../../assets/white_drop_up.png'
import BlueDropUpIcon from '../../../assets/blue_drop_up.png'
import GreenDropUpIcon from '../../../assets/green_drop_up.png'
import { isMainnet } from '../../../utils/chain'
import LanDropdown, { useLanguageText } from '../../Dropdown/Language'
import { useCurrentLanguage, useToggleLanguage } from '../../../utils/i18n'

const getDropdownIcon = (showDropdown: boolean) => {
  if (!showDropdown) return WhiteDropdownIcon
  return isMainnet() ? GreenDropUpIcon : BlueDropUpIcon
}

export const LanguageDropdown = () => {
  const [showLanguage, setShowLanguage] = useState(false)
  const [languageLeft, setLanguageLeft] = useState(0)
  const [languageTop, setLanguageTop] = useState(0)
  const currentLanguage = useCurrentLanguage()

  useLayoutEffect(() => {
    if (showLanguage) {
      const languageDropdownComp = document.getElementById('header__language__panel')
      if (languageDropdownComp) {
        const languageDropdownReact = languageDropdownComp.getBoundingClientRect()
        if (languageDropdownReact) {
          setLanguageLeft(languageDropdownReact.left + (currentLanguage === 'en' ? -15 : 3))
          setLanguageTop(languageDropdownReact.bottom - 3)
        }
      }
    }
  }, [showLanguage])

  return (
    <HeaderLanguagePanel
      id="header__language__panel"
      showLanguage={showLanguage}
      onMouseLeave={() => {
        setShowLanguage(false)
      }}
    >
      <SimpleButton
        className="headerLanguageFlag"
        onMouseOver={() => {
          setShowLanguage(true)
        }}
      >
        <div className="headerLanguageContentPanel">
          <div className="headerLanguageContent">{useLanguageText()}</div>
          <img src={getDropdownIcon(showLanguage)} alt="dropdown icon" />
        </div>
      </SimpleButton>
      {showLanguage && <LanDropdown setShow={setShowLanguage} left={languageLeft} top={languageTop} />}
    </HeaderLanguagePanel>
  )
}

export const LanguageMenu: FC<{ hideMobileMenu: () => void }> = ({ hideMobileMenu }) => {
  const [showSubMenu, setShowSubMenu] = useState(false)
  const currentLanguage = useCurrentLanguage()
  const toggleLanguage = useToggleLanguage()
  const { t } = useTranslation()

  return (
    <MobileSubMenuPanel showSubMenu={false}>
      <SimpleButton
        className="mobileMenusMainItem"
        onClick={() => {
          setShowSubMenu(!showSubMenu)
        }}
      >
        <div className="mobileMenusMainItemContent">
          {currentLanguage === 'en' ? t('navbar.language_en') : t('navbar.language_zh')}
        </div>
        <img
          className="mobileMenusMainItemIcon"
          alt="mobile language icon"
          src={showSubMenu ? WhiteDropUpIcon : WhiteDropdownIcon}
        />
      </SimpleButton>
      {showSubMenu && (
        <>
          <SimpleButton
            className="mobileMenusSubItem"
            onClick={() => {
              hideMobileMenu()
            }}
          >
            {currentLanguage === 'en' ? t('navbar.language_en') : t('navbar.language_zh')}
          </SimpleButton>
          <SimpleButton
            className="mobileMenusSubItem"
            onClick={() => {
              toggleLanguage()
              hideMobileMenu()
            }}
          >
            {currentLanguage === 'en' ? t('navbar.language_zh') : t('navbar.language_en')}
          </SimpleButton>
        </>
      )}
    </MobileSubMenuPanel>
  )
}
