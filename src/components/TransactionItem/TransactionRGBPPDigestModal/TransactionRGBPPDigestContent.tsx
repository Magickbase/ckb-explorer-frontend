import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import { TransactionRGBPPDigestTransfer } from './TransactionRGBPPDigestTransfer'
import { useSetToast } from '../../Toast'
import { explorerService } from '../../../services/ExplorerService'
import SmallLoading from '../../Loading/SmallLoading'
import { TransactionLeapDirection } from '../../RGBPP/types'
import SimpleButton from '../../SimpleButton'
import EllipsisMiddle from '../../EllipsisMiddle'
import config from '../../../config'
import styles from './styles.module.scss'

export const TransactionRGBPPDigestContent = ({
  leapDirection,
  hash,
}: {
  leapDirection: TransactionLeapDirection
  hash: string
}) => {
  const { t } = useTranslation()
  const setToast = useSetToast()

  const { data, isFetched } = useQuery(['rgb-digest', hash], () => explorerService.api.fetchRGBDigest(hash))

  if (!isFetched) {
    return (
      <div className={styles.digestLoading}>
        <SmallLoading />
      </div>
    )
  }
  if (!data) {
    return <div className={styles.noRecords}>no</div>
  }
  return (
    <div className={styles.content}>
      <div className={styles.transactionInfo}>
        <div className={styles.txid}>
          <span>{t('address.seal_tx_on_bitcoin')}</span>
          <a href={`${config.BITCOIN_EXPLORER}/tx/${data.data.txid}`} target="_blank" rel="noopener noreferrer">
            <EllipsisMiddle text={data.data.txid} />
          </a>
          <span className={styles.blockConfirm}>({data.data.confirmations} Confirmations on Bitcoin)</span>
          {leapDirection !== TransactionLeapDirection.NONE ? (
            <Tooltip placement="top" title={t(`address.leap_${leapDirection}_tip`)}>
              <span className={styles.leap}>{t(`address.leap_${leapDirection}`)}</span>
            </Tooltip>
          ) : null}
        </div>
        {data.data.commitment ? (
          <div className={styles.commitment}>
            <span>Commitment:</span>
            <EllipsisMiddle text={data.data.commitment} className={styles.commitmentText} />
            <SimpleButton
              className={styles.action}
              onClick={() => {
                navigator.clipboard.writeText(data.data.commitment)
                setToast({ message: t('common.copied') })
              }}
            >
              <CopyIcon />
            </SimpleButton>
          </div>
        ) : null}
      </div>
      {data.data.transfers && data.data.transfers.length > 0 ? (
        data.data.transfers.map(transfer =>
          transfer && transfer.address ? <TransactionRGBPPDigestTransfer transfer={transfer} /> : null,
        )
      ) : (
        <div className={styles.noRecords}>{t('transaction.no_records')}</div>
      )}
    </div>
  )
}
