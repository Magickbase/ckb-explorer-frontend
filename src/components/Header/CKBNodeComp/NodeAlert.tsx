import { useTranslation } from 'react-i18next'
import styles from './style.module.scss'

const NodeAlert = () => {
  const { t } = useTranslation()

  return <div className={styles.alert}>{t('node.alert')}</div>
}

export default NodeAlert
