import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import { ReactComponent as RedirectIcon } from '../../../assets/redirect-icon.svg'
import { TransactionRGBPPDigestTransfer } from './TransactionRGBPPDigestTransfer'
import { useSetToast } from '../../Toast'
import { explorerService, LiteTransfer } from '../../../services/ExplorerService'
import SmallLoading from '../../Loading/SmallLoading'
import { TransactionLeapDirection } from '../../RGBPP/types'
import SimpleButton from '../../SimpleButton'
import EllipsisMiddle from '../../EllipsisMiddle'
import styles from './styles.module.scss'
import AddressText from '../../AddressText'
import { useIsMobile } from '../../../hooks'
import { Link } from '../../Link'
import config from '../../../config'

export const TransactionRGBPPDigestContent = ({ hash }: { hash: string }) => {
  const { t } = useTranslation()
  const setToast = useSetToast()
  const isMobile = useIsMobile()

  const { data, isFetched } = useQuery(['rgb-digest', hash], () => explorerService.api.fetchRGBDigest(hash))

  const direction = useMemo(() => {
    switch (data?.data.leapDirection) {
      case 'in':
        return TransactionLeapDirection.IN
      case 'out':
        return TransactionLeapDirection.OUT
      case 'withinBTC':
        return TransactionLeapDirection.WITH_IN_BTC
      default:
        return TransactionLeapDirection.NONE
    }
  }, [data])

  const transfers = useMemo(() => {
    const m = new Map<string, LiteTransfer.Transfer[]>()
    data?.data.transfers?.forEach(tf => {
      const list = m.get(tf.address) || []
      tf.transfers.forEach(i => {
        let asset: LiteTransfer.Transfer | undefined
        switch (i.cellType) {
          case 'normal': {
            asset = list.find(j => j.cellType === 'normal')
            break
          }
          case 'udt':
          case 'xudt_compatible':
          case 'xudt':
          case 'omiga_inscription': {
            asset = list.find(j => j.cellType === i.cellType && j.udtInfo?.typeHash === i.udtInfo?.typeHash) as
              | LiteTransfer.XudtTransfer
              | LiteTransfer.UDTTransfer
              | LiteTransfer.OmigaTransfer
              | undefined
            if (asset) {
              asset.capacity = new BigNumber(asset.capacity).plus(i.capacity).toString()
              asset.udtInfo.amount = new BigNumber(asset.udtInfo.amount).plus(i.udtInfo.amount).toString()
            }
            break
          }
          case 'spore_cell': {
            asset = list.find(j => j.cellType === i.cellType && j.tokenId === i.tokenId) as
              | LiteTransfer.SporeTransfer
              | undefined
            if (asset) {
              asset.capacity = new BigNumber(asset.capacity).plus(i.capacity).toString()
              asset.count = new BigNumber(asset.count).plus(i.count).toString()
            }
            break
          }
          case 'nrc_721_token':
          case 'cota_regular': {
            // ignore
            break
          }
          default: {
            // ignore
          }
        }

        if (!asset) {
          list.push(i)
        }
      })
      m.set(tf.address, list)
    })
    return m
  }, [data?.data.transfers])

  if (!isFetched) {
    return (
      <div className={styles.digestLoading}>
        <SmallLoading />
      </div>
    )
  }
  if (!data) {
    return <div className={styles.noRecords}>{t('transaction.no_records')}</div>
  }

  return (
    <div className={styles.content}>
      {data.data.commitment ? (
        <div className={styles.transactionInfo}>
          <div className={styles.txid}>
            <span>{t('address.seal_tx_on_bitcoin')}</span>
            {data.data.txid && (
              <>
                <AddressText
                  ellipsisMiddle={!isMobile}
                  linkProps={{
                    to: `/transaction/${hash}`,
                  }}
                  className={styles.address}
                  style={{ overflow: 'hidden' }}
                >
                  {data.data.txid}
                </AddressText>
                <Link to={`${config.BITCOIN_EXPLORER}/tx/${data.data.txid}`} className={styles.action}>
                  <RedirectIcon />
                </Link>
              </>
            )}
          </div>
          <div className={styles.btcConfirmationsAndDirection}>
            {typeof data.data.confirmations === 'number' && (
              <span className={styles.blockConfirm}>({data.data.confirmations} Confirmations on Bitcoin)</span>
            )}
            {direction !== TransactionLeapDirection.NONE ? (
              <Tooltip placement="top" title={t(`address.leap_${direction}_tip`)}>
                <span className={styles.leap}>{t(`address.leap_${direction}`)}</span>
              </Tooltip>
            ) : null}
          </div>
          <div className={styles.commitment}>
            <span>Commitment:</span>
            <div style={{ width: '64ch', minWidth: '20ch' }}>
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
          </div>
        </div>
      ) : null}
      <div className={styles.list}>
        {transfers.size ? (
          [...transfers.entries()].map(([address, transfers]) => (
            <TransactionRGBPPDigestTransfer address={address} transfers={transfers} />
          ))
        ) : (
          <div className={styles.noRecords}>{t('transaction.no_records')}</div>
        )}
      </div>
    </div>
  )
}
