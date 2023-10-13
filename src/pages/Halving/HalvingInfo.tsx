import { Tooltip } from 'antd'
import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import dayjs from 'dayjs'
import { ReactComponent as WarningCircle } from '../../assets/warning_circle.svg'
import i18n from '../../utils/i18n'
import { useHalving, useIsMobile } from '../../utils/hook'
import { useStatistics } from '../../services/ExplorerService'
import styles from './index.module.scss'

export const HalvingInfo = () => {
  const statistics = useStatistics()
  const isMobile = useIsMobile()
  const { currentEpoch, targetEpoch, estimatedDate } = useHalving()
  const utcOffset = dayjs().utcOffset() / 60

  if (isMobile) {
    return (
      <>
        <div className={styles.epochInfo}>
          <div className={styles.epochInfoItem}>
            <strong className={styles.epochInfoValue}>{new BigNumber(statistics.tipBlockNumber).toFormat()}</strong>
            <div className={styles.textSecondary}>{i18n.t('halving.current_block')}</div>
          </div>
          <div className={styles.separate} />
          <div className={styles.epochInfoItem}>
            <strong className={styles.epochInfoValue}>
              <span style={{ marginRight: 4 }}>{new BigNumber(currentEpoch).toFormat()}</span>
              <small className={styles.textSecondary}>
                {statistics.epochInfo.index} / {statistics.epochInfo.epochLength}
              </small>
            </strong>
            <div className={styles.textSecondary}>{i18n.t('halving.current_epoch')}</div>
          </div>
        </div>

        <div className={styles.epochInfo}>
          <div className={styles.epochInfoItem}>
            <strong className={styles.epochInfoValue}>{new BigNumber(targetEpoch).toFormat()}</strong>
            <div className={styles.textSecondary}>{i18n.t('halving.target_epoch')}</div>
          </div>

          <div className={styles.separate} />

          <div className={styles.epochInfoItem}>
            <div className={styles.epochInfoValue}>
              <Tooltip
                placement="topRight"
                color="#fff"
                overlayInnerStyle={{ color: '#333333' }}
                title={`UTC ${utcOffset > 0 ? `+ ${utcOffset}` : utcOffset}`}
              >
                <div className={styles.flexItemsCenter}>
                  {dayjs(estimatedDate).format('YYYY.MM.DD hh:mm:ss')}
                  <WarningCircle style={{ marginLeft: 2 }} width={12} height={12} />
                </div>
              </Tooltip>
            </div>
            <div className={classnames(styles.textSecondary, styles.fontSizeSm)}>
              {i18n.t('halving.estimated_time')}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={styles.epochInfo}>
      <div className={styles.epochInfoItem}>
        <strong className={styles.epochInfoValue}>{new BigNumber(statistics.tipBlockNumber).toFormat()}</strong>
        <div className={styles.textSecondary}>{i18n.t('halving.current_block')}</div>
      </div>
      <div className={styles.separate} />
      <div className={styles.epochInfoItem}>
        <strong className={styles.epochInfoValue}>
          <span style={{ marginRight: 4 }}>{new BigNumber(currentEpoch).toFormat()}</span>
          <small className={styles.textSecondary}>
            {statistics.epochInfo.index} / {statistics.epochInfo.epochLength}
          </small>
        </strong>
        <div className={styles.textSecondary}>{i18n.t('halving.current_epoch')}</div>
      </div>
      <div className={styles.separate} />

      <div className={styles.epochInfoItem}>
        <strong className={styles.epochInfoValue}>{new BigNumber(targetEpoch).toFormat()}</strong>
        <div className={styles.textSecondary}>{i18n.t('halving.target_epoch')}</div>
      </div>
      <div className={styles.separate} />

      <div className={styles.epochInfoItem}>
        <strong className={styles.epochInfoValue}>
          {dayjs(estimatedDate).format('YYYY.MM.DD hh:mm:ss')}
          <Tooltip
            color="#fff"
            overlayInnerStyle={{ color: '#333333' }}
            title={`UTC ${utcOffset > 0 ? `+ ${utcOffset}` : utcOffset}`}
          >
            <WarningCircle style={{ cursor: 'pointer', marginLeft: '4px' }} width={16} height={16} />
          </Tooltip>
        </strong>
        <div className={styles.textSecondary}>{i18n.t('halving.estimated_time')}</div>
      </div>
    </div>
  )
}
