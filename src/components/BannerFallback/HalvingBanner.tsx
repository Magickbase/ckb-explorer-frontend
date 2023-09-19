import classnames from 'classnames'
import styles from './index.module.scss'
import SimpleButton from '../SimpleButton'
import { useCountdown, useHalving } from '../../utils/hook'
import i18n from '../../utils/i18n'
import { capitalizeFirstLetter } from '../../utils/string'

export const HalvingBanner = () => {
  const { estimatedDate, nextHalvingCount } = useHalving()
  const [days, hours, minutes, seconds] = useCountdown(estimatedDate)

  const shortCountdown = () => {
    if (days > 0) {
      return `${days}${i18n.t('symbol.char_space')}${capitalizeFirstLetter(i18n.t('unit.days'))}`
    }
    if (hours > 0) {
      return `${hours}${i18n.t('symbol.char_space')}${capitalizeFirstLetter(i18n.t('unit.hours'))}`
    }
    if (minutes > 0) {
      return `${minutes}${i18n.t('symbol.char_space')}${capitalizeFirstLetter(i18n.t('unit.minutes'))}`
    }
    if (seconds > 0) {
      return `${seconds}${i18n.t('symbol.char_space')}${capitalizeFirstLetter(i18n.t('unit.seconds'))}`
    }
    return `${capitalizeFirstLetter(i18n.t('halving.halving'))}!`
  }

  return (
    <div className={styles.root}>
      <div className={styles.HalvingBannerShadow}>
        <div className={classnames(styles.HalvingBanner, 'container')}>
          {nextHalvingCount === 1 ? (
            <div className={styles.HalvingBannerText}>
              Nervos CKB Layer 1 {i18n.t('halving.halving_countdown')}
              <div className={styles.HalvingBannerCount}>{shortCountdown()}</div>
            </div>
          ) : (
            <div className={styles.HalvingBannerText}>{i18n.t('halving.first_congratulation')}</div>
          )}

          <a style={{ marginLeft: 'auto' }} href="/halving">
            <SimpleButton className={styles.LearnMoreButton}>{i18n.t('halving.learn_more')}</SimpleButton>
          </a>
        </div>
      </div>
    </div>
  )
}
