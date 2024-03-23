/* eslint-disable react/no-array-index-key */
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Card } from '../../../components/Card'
import styles from './TransactionDetailsHeader.module.scss'
import { TransactionRGBPPDigestContent } from '../../../components/TransactionItem/TransactionRGBPPDigestModal/TransactionRGBPPDigestContent'
import BtcTransaction from '../../../components/Btc/Transaction'
import { TransactionLeapDirection } from '../../../components/RGBPP/types'
import { explorerService, RawBtcRPC } from '../../../services/ExplorerService'
import SmallLoading from '../../../components/Loading/SmallLoading'

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
  const { data: btcTx, isLoading: isBtcTxLoading } = useQuery(['btc_tx', txid], () =>
    explorerService.api.getBtcTxList([txid]).then((res: Record<string, RawBtcRPC.BtcTx>) => res[txid]),
  )
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
          {isBtcTxLoading ? <SmallLoading /> : null}
          {btcTx ? <BtcTransaction tx={btcTx} showId={false} /> : null}
        </div>
      </Card>
    </>
  )
}
