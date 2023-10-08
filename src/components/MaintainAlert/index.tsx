import { useI18n } from '../../utils/i18n'
import { IS_MAINTAINING } from '../../constants/common'
import styles from './styles.module.scss'

const MaintainAlert = () => {
  const { i18n } = useI18n()
  const { t } = i18n
  if (IS_MAINTAINING) {
    return <div className={styles.container}>{t('error.maintain')}</div>
  }

  return null
}

export default MaintainAlert
