/* eslint-disable react/no-array-index-key */
import { useTranslation } from 'react-i18next'
import { Card } from '../../../components/Card'
import styles from './TransactionDetailsHeader.module.scss'
import { TransactionRGBPPDigestContent } from '../../../components/TransactionItem/TransactionRGBPPDigestModal/TransactionRGBPPDigestContent'
import BtcTransaction from '../../../components/Btc/Transaction'
import { TransactionLeapDirection } from '../../../components/RGBPP/types'

export const RGBDigestComp = ({
  hash,
  txid,
  leapDirection,
}: {
  hash: string
  txid: string
  leapDirection: TransactionLeapDirection
}) => {
  const { t } = useTranslation()
  return (
    <>
      <Card className={styles.transactionHeader}>
        <div className={styles.headerContent}>
          <p>{t('transaction.rgb_digest')} </p>
        </div>
      </Card>
      <Card className={styles.digestContent}>
        <TransactionRGBPPDigestContent hash={hash} leapDirection={leapDirection} />
        <div className={styles.btcTxContent}>
          <BtcTransaction txid={txid} showId={false} />
        </div>
      </Card>
    </>
  )
}
