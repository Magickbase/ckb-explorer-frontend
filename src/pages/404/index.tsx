import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
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

const NotFoundPanel = styled.div`
  margin-top: 120px;
  margin-bottom: 140px;
`

const NotFoundImage = styled.img`
  width: 1038px;
  height: 480px;
  margin: 0 auto;
  display: block;

  @media (max-width: 750px) {
    width: 282px;
    height: 130px;
  }
`

const NotErrorImage = styled.img`
  width: 602px;
  height: 273px;
  margin: 90px auto;
  display: block;
  border: 1px dashed #9c9c9c;
  padding: 6px;

  @media (max-width: 750px) {
    width: 228px;
    height: 108px;
  }
`

const get404Image = (isMobile: boolean) => {
  if (isMainnet()) {
    return isMobile ? Mobile404Image : PC404mage
  }
  return isMobile ? MobileBlue404Image : PCBlue404Image
}

export default ({ errorMessage, errorDescription }: { errorMessage?: string; errorDescription?: string }) => {
  const isMobile = useIsMobile()
  const [t] = useTranslation()
  const history = useHistory()

  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <Content>
      <NotFoundPanel className="container">
        {errorMessage || errorDescription ? (
          <>
            <NotErrorImage src={isMobile ? MobileErrorImage : PCErrorImage} alt="error" />
            <div className={styles.pageCrashedTip}>{t('error.page_crashed_tip')}</div>
            <button
              type="button"
              className={styles.backHomeButton}
              onClick={() => {
                history.push('/')
              }}
            >
              BACK HOME
            </button>
          </>
        ) : (
          <NotFoundImage src={get404Image(isMobile)} alt="404" />
        )}

        {!isProduction && (
          <pre className={styles.pageCrashedError}>
            {errorMessage}
            {errorDescription}
          </pre>
        )}
      </NotFoundPanel>
    </Content>
  )
}
