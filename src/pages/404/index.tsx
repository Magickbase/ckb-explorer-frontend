import { useTranslation } from 'react-i18next'
import Content from '../../components/Content'
import PC404mage from '../../assets/pc_404.png'
import Mobile404Image from '../../assets/mobile_404.png'
import PCBlue404Image from '../../assets/blue_pc_404.png'
import PCErrorImage from '../../assets/error.png'
import MobileErrorImage from '../../assets/Mobile_error.png'
import MobileBlue404Image from '../../assets/blue_mobile_404.png'
import { useIsMobile } from '../../utils/hook'
import { isMainnet } from '../../utils/chain'
import styles from './index.module.scss'

const get404Image = (isMobile: boolean) => {
  if (isMainnet()) {
    return isMobile ? Mobile404Image : PC404mage
  }
  return isMobile ? MobileBlue404Image : PCBlue404Image
}

export default ({ errorMessage, errorDescription }: { errorMessage?: string; errorDescription?: string }) => {
  const isMobile = useIsMobile()
  const [t] = useTranslation()

  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <Content>
      <div className={styles.container}>
        {errorMessage || errorDescription ? (
          <>
            <img className={styles.notErrorImage} src={isMobile ? MobileErrorImage : PCErrorImage} alt="error" />
            <div className={styles.pageCrashedTip}>{t('error.page_crashed_tip')}</div>
            <a className={styles.backHome} href="/" rel="noopener noreferrer">
              {t('error.back_home')}
            </a>
            {!isProduction && (
              <pre className={styles.pageCrashedError}>
                {errorMessage}
                {errorDescription}
              </pre>
            )}
          </>
        ) : (
          <img className={styles.notFoundImage} src={get404Image(isMobile)} alt="404" />
        )}
      </div>
    </Content>
  )
}
