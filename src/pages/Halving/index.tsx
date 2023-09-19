import { Progress, Tooltip } from 'antd'
import moment from 'moment'
import Content from '../../components/Content'
import LogoIcon from '../../assets/ckb_dark.png'
import HelpIcon from '../../assets/qa_help.png'
import baseIssuance from '../../assets/ckb_base_issuance_trend.jpg'
import blockRewards from '../../assets/block-rewards.png'
import { ReactComponent as TwitterIcon } from '../../assets/twitter.svg'
import i18n from '../../utils/i18n'
import {
  HalvingTitle,
  Paragraph,
  StrongText,
  HalvingPanel,
  HalvingPanelTitle,
  HalvingDocuments,
  HalvingCountdown,
  HalvingCountdownItem,
  HalvingCountdownValue,
  HalvingLogo,
  EpochInfoItem,
  EpochInfo,
  Separate,
  Secondary,
  Container,
  HalvingCountdownName,
  Blockquote,
  Code,
  Panel,
  Img,
} from './styled'
import { HalvingTable } from './HalvingTable'
import { useAppState } from '../../contexts/providers'
import { useCountdown, useHalving } from '../../utils/hook'
import { capitalizeFirstLetter } from '../../utils/string'
import { getPrimaryColor } from '../../constants/common'
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
  const { statistics } = useAppState()
  const {
    currentEpoch,
    targetEpoch,
    estimatedDate,
    singleEpochAverageTime,
    currentEpochUsedTime,
    EPOCHS_PER_HALVING,
    nextHalvingCount,
  } = useHalving()
  const percent =
    ((currentEpoch * singleEpochAverageTime - currentEpochUsedTime) / (EPOCHS_PER_HALVING * singleEpochAverageTime)) *
    100
  const [days, hours, minutes, seconds] = useCountdown(estimatedDate)

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

  const shareText = i18n.t('halving.twitter_text', {
    times: i18n.t(`ordinal.${numberToOrdinal(nextHalvingCount)}`),
    date: estimatedDate.toUTCString(),
    countdown: shortCountdown(),
  })

  const shareUrl = `https://twitter.com/share?text=${encodeURIComponent(shareText)}&hashtags=CKB%2CPoW%2CHalving`
  const utcOffset = moment().utcOffset() / 60

  return (
    <Content>
      <Container className="container">
        <HalvingTitle>Nervos CKB Layer 1 {i18n.t('halving.halving_countdown')}</HalvingTitle>
        <Paragraph>
          Nervos CKB Layer 1 {i18n.t('halving.halving_desc_prefix')}{' '}
          <StrongText>{i18n.t('halving.base_issuance_rewards')}</StrongText> {i18n.t('halving.halving_desc_suffix')}
        </Paragraph>
        <HalvingPanel>
          <HalvingPanelTitle>
            {capitalizeFirstLetter(i18n.t(`ordinal.${numberToOrdinal(nextHalvingCount)}`))}
            {i18n.t('symbol.char_space')}
            {capitalizeFirstLetter(i18n.t('halving.halving'))}
          </HalvingPanelTitle>
          <HalvingCountdown>
            <HalvingLogo src={LogoIcon} alt="logo" />
            <HalvingCountdownItem>
              <HalvingCountdownValue>{days}</HalvingCountdownValue>
              <HalvingCountdownName>{i18n.t('common.days')}</HalvingCountdownName>
            </HalvingCountdownItem>
            <HalvingCountdownItem>
              <HalvingCountdownValue>{hours}</HalvingCountdownValue>
              <HalvingCountdownName>{i18n.t('common.hours')}</HalvingCountdownName>
            </HalvingCountdownItem>
            <HalvingCountdownItem>
              <HalvingCountdownValue>{minutes}</HalvingCountdownValue>
              <HalvingCountdownName>{i18n.t('common.minutes')}</HalvingCountdownName>
            </HalvingCountdownItem>
            <HalvingCountdownItem>
              <HalvingCountdownValue>{seconds}</HalvingCountdownValue>
              <HalvingCountdownName>{i18n.t('common.seconds')}</HalvingCountdownName>
            </HalvingCountdownItem>

            <Tooltip
              placement="top"
              title={
                <>
                  <Paragraph>{i18n.t('halving.countdown_tooltip_section1')}</Paragraph>
                  <Paragraph>
                    <StrongText>{i18n.t('halving.countdown_tooltip_section2')}</StrongText>
                  </Paragraph>
                  <Paragraph>{i18n.t('halving.countdown_tooltip_section3')}</Paragraph>
                </>
              }
            >
              <img alt="halving help" src={HelpIcon} />
            </Tooltip>
          </HalvingCountdown>
          <Progress strokeColor={getPrimaryColor()} style={{ paddingRight: 16 }} percent={Number(percent.toFixed(2))} />
          <EpochInfo>
            <EpochInfoItem>
              <div>{i18n.t('halving.current_block')}</div>
              <StrongText>{statistics.tipBlockNumber}</StrongText>
            </EpochInfoItem>
            <Separate />
            <EpochInfoItem>
              <div>{i18n.t('halving.current_epoch')}</div>
              <StrongText>
                <span style={{ marginRight: 4 }}>{currentEpoch}</span>
                <Secondary>
                  {statistics.epochInfo.index} / {statistics.epochInfo.epochLength}
                </Secondary>
              </StrongText>
            </EpochInfoItem>
            <Separate />

            <EpochInfoItem>
              <div>{i18n.t('halving.target_epoch')}</div>
              <StrongText>{targetEpoch}</StrongText>
            </EpochInfoItem>
            <Separate />

            <EpochInfoItem>
              <div>{i18n.t('halving.estimated_time')}</div>
              <Tooltip title={`UTC ${utcOffset > 0 ? `+ ${utcOffset}` : utcOffset}`}>
                <StrongText>{moment(estimatedDate).format('YYYY.MM.DD hh:mm:ss')}</StrongText>
              </Tooltip>
            </EpochInfoItem>
          </EpochInfo>
        </HalvingPanel>
        <Panel>
          <HalvingDocuments>
            <h2>{i18n.t('halving.halving_event')}</h2>
            <Paragraph>{i18n.t('halving.halving_event_section_1')}</Paragraph>
            <Paragraph>{i18n.t('halving.halving_event_section_2')}</Paragraph>
          </HalvingDocuments>
          <HalvingDocuments>
            <h2>{i18n.t('halving.significance')}</h2>
            <Paragraph>{i18n.t('halving.significance_section_1')}</Paragraph>
            <Paragraph>{i18n.t('halving.significance_section_2')}</Paragraph>
          </HalvingDocuments>
          <HalvingDocuments>
            <h2>{i18n.t('halving.how_does_work')}</h2>
            <Paragraph>{i18n.t('halving.how_does_work_section_1')}</Paragraph>
            <Blockquote>
              <Paragraph>{i18n.t('halving.how_does_work_section_2')}</Paragraph>
              <Paragraph>{i18n.t('halving.how_does_work_section_3')}</Paragraph>
            </Blockquote>
            <Paragraph>
              {i18n.t('halving.how_does_work_section_4')} <Code>4 * 365 * (24 / 4)</Code> = <Code>8760</Code>,{' '}
              {i18n.t('halving.how_does_work_section_5')}: <Code>the_Nth_halving_epoch = 8760 * N </Code>.
            </Paragraph>
            <Paragraph>{i18n.t('halving.how_does_work_section_6')}</Paragraph>
          </HalvingDocuments>

          <HalvingDocuments>
            <h2>{i18n.t('halving.when')}</h2>
            <Paragraph>{i18n.t('halving.when_section_1')}</Paragraph>
            <HalvingTable />
            <Img loading="lazy" src={baseIssuance} alt="ckb base issuance trend" />
            <Paragraph>
              ⚠️ {i18n.t('halving.when_section_2')}
              <strong>{i18n.t('halving.when_section_3')}</strong>, {i18n.t('halving.and')}{' '}
              <strong>{i18n.t('halving.when_section_4')}</strong>:
            </Paragraph>
            <Img loading="lazy" src={blockRewards} alt="block rewards" />
            <Paragraph>
              {i18n.t('halving.when_section_5')}
              <strong>{i18n.t('halving.base_issuance_rewards')}</strong>
              {i18n.t('halving.when_section_6')}
            </Paragraph>
          </HalvingDocuments>
        </Panel>
      </Container>
      <Tooltip title={i18n.t('halving.share_tooltip')}>
        <a className={styles.twitterShareWrapper} href={shareUrl} target="_blank" rel="noreferrer">
          <div className={styles.twitterIconBg}>
            <TwitterIcon fill="white" height={40} width={40} />
          </div>
        </a>
      </Tooltip>
    </Content>
  )
}

export default HalvingCountdownPage
