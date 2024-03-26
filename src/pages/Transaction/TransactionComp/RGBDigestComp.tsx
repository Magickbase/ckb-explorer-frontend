/* eslint-disable react/no-array-index-key */
import { useMemo } from 'react'
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

  const { data: displayInputs } = useQuery(
    ['transaction_inputs', hash, 1, 10],
    async () => {
      try {
        const res = await explorerService.api.fetchCellsByTxHash(hash, 'inputs', { no: 1, size: 10 })
        return res
      } catch (e) {
        return { data: [] }
      }
    },
    {
      initialData: { data: [] },
    },
  )

  const { data: displayOutputs } = useQuery(
    ['transaction_outputs', hash, 1, 10],
    async () => {
      try {
        const res = await explorerService.api.fetchCellsByTxHash(hash, 'outputs', {
          no: 1,
          size: 10,
        })
        return res
      } catch (e) {
        return { data: [] }
      }
    },
    {
      initialData: { data: [] },
    },
  )
  const boundCellIndex = useMemo(() => {
    const map: Record<string, number> = {}
    displayInputs.data.forEach((input, idx) => {
      if (!input.rgbInfo) return
      map[`${input.rgbInfo.txid}-${input.rgbInfo.index}`] = idx
    })
    displayOutputs.data.forEach((output, idx) => {
      if (!output.rgbInfo) return
      map[`${output.rgbInfo.txid}-${output.rgbInfo.index}`] = idx
    })
    return map
  }, [displayInputs, displayOutputs])

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
          {btcTx ? <BtcTransaction tx={btcTx} showId={false} boundCellIndex={boundCellIndex} /> : null}
        </div>
      </Card>
    </>
  )
}
