import { Progress, Tooltip, Popover, Table } from 'antd'
import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import Content from '../../components/Content'
import baseIssuance from '../../assets/ckb_base_issuance_trend.png'
import blockRewards from '../../assets/block-rewards.png'
import blockRewardsCN from '../../assets/block-rewards-cn.png'
import halvingBg from '../../assets/halving_bg.png'
import halvingSuccessBg from '../../assets/halving_success_bg.png'
import { ReactComponent as CalendarIcon } from '../../assets/calendar.svg'
import { ReactComponent as XIcon } from '../../assets/X.svg'
import { ReactComponent as WarningCircle } from '../../assets/warning_circle.svg'
import i18n, { currentLanguage } from '../../utils/i18n'
import { HalvingTable } from './HalvingTable'
import { HalvingInfo } from './HalvingInfo'
import SmallLoading from '../../components/Loading/SmallLoading'
import { useStatistics } from '../../services/ExplorerService'
import { HalvingCountdown } from './HalvingCountdown'
import { useCountdown, useHalving, useIsMobile } from '../../utils/hook'
import { getPrimaryColor, EPOCHS_PER_HALVING, THEORETICAL_EPOCH_TIME } from '../../constants/common'
import styles from './index.module.scss'

function numberToOrdinal(number: number) {
  switch (number) {
    case 1:
      return 'first'
    case 2:
      return 'second'
    default:
      break
  }

  switch (number % 10) {
    case 1:
      return `${number}st`
    case 2:
      return `${number}nd`
    case 3:
      return `${number}rd`
    default:
      return `${number}th`
  }
}

export const HalvingCountdownPage = () => {
  const isMobile = useIsMobile()
  const statistics = useStatistics()
  const { currentEpoch, estimatedDate, currentEpochUsedTime, halvingCount, inCelebration, skipCelebration, isLoading } =
    useHalving()

  const percent =
    (((currentEpoch % EPOCHS_PER_HALVING) * THEORETICAL_EPOCH_TIME - currentEpochUsedTime) /
      (EPOCHS_PER_HALVING * THEORETICAL_EPOCH_TIME)) *
    100
  const [days, hours, minutes, seconds, expired] = useCountdown(estimatedDate)

  const shortCountdown = () => {
    if (days > 0) {
      return `${days}${i18n.t('symbol.char_space')}${i18n.t('unit.days')}`
    }
    if (hours > 0) {
      return `${hours}${i18n.t('symbol.char_space')}${i18n.t('unit.hours')}`
    }
    if (minutes > 0) {
      return `${minutes}${i18n.t('symbol.char_space')}${i18n.t('unit.minutes')}`
    }
    return `${seconds}${i18n.t('symbol.char_space')}${i18n.t('unit.seconds')}`
  }

  const shareText = i18n.t('halving.share_text', {
    times: i18n.t(`ordinal.${numberToOrdinal(halvingCount)}`),
    date: estimatedDate.toUTCString(),
    countdown: shortCountdown(),
  })
  const shareUrl = `https://x.com/share?text=${encodeURIComponent(shareText)}&hashtags=CKB%2CPoW%2CHalving`
  const getTargetBlockByHavingCount = (count: number) => {
    return (
      EPOCHS_PER_HALVING *
      (statistics.epochInfo.epochLength ? parseInt(statistics.epochInfo.epochLength, 10) : 1800) *
      count
    )
  }

  const renderHalvingPanel = () => {
    if (isLoading || Number.isNaN(seconds)) {
      return (
        <div className={styles.halvingPanelWrapper}>
          <div className={classnames(styles.halvingPanel, styles.loadingPanel)}>
            <SmallLoading />
          </div>
        </div>
      )
    }

    if (inCelebration) {
      return (
        <div className={styles.halvingPanelWrapper}>
          <div
            className={styles.halvingPanel}
            style={{ paddingTop: isMobile ? 64 : 128, paddingBottom: 128, backgroundImage: `url(${halvingSuccessBg})` }}
          >
            <div className={classnames(styles.halvingSuccessText, styles.textCenter)}>
              {i18n.t('halving.congratulations')}!
              <div>
                <span className={styles.textCapitalize}>{i18n.t('halving.the')}</span>
                {i18n.t('symbol.char_space')}
                {i18n.t(`ordinal.${numberToOrdinal(halvingCount)}`)}
                {i18n.t('symbol.char_space')}
                {i18n.t('halving.halving')}
                {i18n.t('symbol.char_space')}
                {i18n.t('halving.actived')}{' '}
                <a className={styles.textPrimary} href={`/block/${getTargetBlockByHavingCount(halvingCount)}`}>
                  {new BigNumber(getTargetBlockByHavingCount(halvingCount)).toFormat()}.
                </a>
              </div>
            </div>
            <div className={styles.textCenter}>
              <button
                className={classnames(styles.halvingSuccessBtn, styles.textCapitalize)}
                type="button"
                onClick={() => skipCelebration()}
              >
                {i18n.t('halving.next')}
                {i18n.t('symbol.char_space')}
                {i18n.t('halving.halving')}
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (expired) {
      return (
        <div className={styles.halvingPanelWrapper}>
          <div className={classnames(styles.halvingPanel, styles.loadingPanel)}>
            {i18n.t('halving.comming_soon')}
            <SmallLoading />
          </div>
        </div>
      )
    }

    return (
      <div className={styles.halvingPanelWrapper}>
        <div className={styles.halvingPanel}>
          <div className={classnames(styles.halvingPanelTitle, styles.textCapitalize)}>
            {i18n.t(`ordinal.${numberToOrdinal(halvingCount)}`)}
            {i18n.t('symbol.char_space')}
            {i18n.t('halving.halving')}

            {halvingCount > 1 && (
              <Popover
                placement="topLeft"
                arrowPointAtCenter
                content={
                  <Table
                    onHeaderRow={() => ({
                      className: styles.historyTableHeaderRow,
                    })}
                    size="middle"
                    className={styles.historyTable}
                    pagination={false}
                    dataSource={new Array(halvingCount - 1).fill({}).map((_, index) => ({
                      key: index,
                      event: `${i18n.t(`ordinal.${numberToOrdinal(index + 1)}`)}
                  ${i18n.t('symbol.char_space')}
                  ${i18n.t('halving.halving')}`,
                      epoch: new BigNumber(EPOCHS_PER_HALVING * (index + 1)).toFormat(),
                      height: getTargetBlockByHavingCount(index + 1),
                    }))}
                    columns={[
                      {
                        title: 'Event',
                        dataIndex: 'event',
                        key: 'event',
                        render: event => <span className={styles.textCapitalize}>{event}</span>,
                      },
                      { title: 'Epoch', dataIndex: 'epoch', key: 'epoch' },
                      {
                        title: 'Height',
                        dataIndex: 'height',
                        key: 'height',
                        render: block => (
                          <a className={styles.textPrimary} href={`/block/${block}`}>
                            {new BigNumber(block).toFormat()}
                          </a>
                        ),
                      },
                    ]}
                  />
                }
                title={null}
                trigger="hover"
                overlayClassName={styles.halvingPopover}
              >
                <CalendarIcon
                  style={{ marginLeft: 4, cursor: 'pointer' }}
                  width={isMobile ? 16 : 20}
                  height={isMobile ? 16 : 20}
                />
              </Popover>
            )}
            <div style={{ marginLeft: 'auto' }} />

            <Tooltip
              placement={isMobile ? 'topRight' : 'top'}
              color="#fff"
              arrowPointAtCenter
              overlayStyle={{ minWidth: isMobile ? 200 : 400 }}
              overlayInnerStyle={{ color: '#333333' }}
              title={
                <>
                  <p>{i18n.t('halving.countdown_tooltip_section1')}</p>
                  <p>
                    <strong>{i18n.t('halving.countdown_tooltip_section2')}</strong>
                  </p>
                  <p>{i18n.t('halving.countdown_tooltip_section3')}</p>
                </>
              }
            >
              <WarningCircle width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} style={{ cursor: 'pointer' }} />
            </Tooltip>
          </div>

          <HalvingCountdown />

          <div>
            <Progress
              className={styles.halvingProgress}
              strokeColor={getPrimaryColor()}
              percent={Number(percent.toFixed(2))}
              strokeWidth={isMobile ? 8 : 12}
              showInfo={false}
            />
            <div className={styles.halvingProgressMarks}>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
            </div>
          </div>
          <HalvingInfo />
        </div>
      </div>
    )
  }

  return (
    <Content style={{ backgroundColor: 'rgba(16, 16, 16, 1)' }}>
      <div className={styles.halvingBanner} style={{ backgroundImage: `url(${halvingBg})` }}>
        <div className={classnames(styles.halvingBannerWrapper, 'container')}>
          <div className={styles.halvingBannerContent}>
            <div className={styles.halvingTitle}>Nervos CKB Layer 1 {i18n.t('halving.halving_countdown')}</div>
            <div className={styles.halvingSubtitle}>
              Nervos CKB Layer 1 {i18n.t('halving.halving_desc_prefix')}{' '}
              <strong>{i18n.t('halving.base_issuance_rewards')}</strong> {i18n.t('halving.halving_desc_suffix')}
            </div>
            {renderHalvingPanel()}
          </div>
        </div>
        <div className={styles.halvingBannerShadow} />
      </div>

      <div className={classnames(styles.halvingDocuments, 'container')}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>{i18n.t('halving.halving_event')}</div>
          <div>{i18n.t('halving.halving_event_section_1')}</div>
          <div>{i18n.t('halving.halving_event_section_2')}</div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>{i18n.t('halving.significance')}</div>
          <div>{i18n.t('halving.significance_section_1')}</div>
          <div>{i18n.t('halving.significance_section_2')}</div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>{i18n.t('halving.how_does_work')}</div>
          <div>{i18n.t('halving.how_does_work_section_1')}</div>
          <div className={styles.blockquote}>
            <div>{i18n.t('halving.how_does_work_section_2')}</div>
            <div>{i18n.t('halving.how_does_work_section_3')}</div>
          </div>
          <div>
            <div>
              {i18n.t('halving.how_does_work_section_4')} <strong>4 * 365 * (24 / 4)</strong> = <strong>8760</strong>,{' '}
              {i18n.t('halving.how_does_work_section_5')}: <strong>the_Nth_halving_epoch = 8760 * N </strong>.
            </div>
            <div>{i18n.t('halving.how_does_work_section_6')}</div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>{i18n.t('halving.when')}</div>
          <div>
            {i18n.t('halving.when_section_1')}
            <HalvingTable />
          </div>
          <img style={{ maxWidth: '100%' }} loading="lazy" src={baseIssuance} alt="ckb base issuance trend" />
          <div>
            ⚠️ {i18n.t('halving.when_section_2')}
            <strong>{i18n.t('halving.when_section_3')}</strong>, {i18n.t('halving.and')}{' '}
            <strong>{i18n.t('halving.when_section_4')}</strong>:
          </div>
          <img
            style={{ maxWidth: '100%', borderRadius: 8 }}
            loading="lazy"
            src={currentLanguage() === 'zh' ? blockRewardsCN : blockRewards}
            alt="block rewards"
          />
          <div>
            {i18n.t('halving.when_section_5')}
            <strong>{i18n.t('halving.base_issuance_rewards')}</strong>
            {i18n.t('halving.when_section_6')}
          </div>
        </div>
      </div>

      <Tooltip title={i18n.t('halving.share_tooltip')}>
        <a className={styles.shareWrapper} href={shareUrl} target="_blank" rel="noreferrer">
          <div className={styles.xIconBg}>
            <XIcon fill="white" height={40} width={40} />
          </div>
        </a>
      </Tooltip>
    </Content>
  )
}

export default HalvingCountdownPage
