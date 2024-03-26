import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import { type RawBtcRPC } from '../../../services/ExplorerService'
import config from '../../../config'
import styles from './styles.module.scss'
import AddressText from '../../AddressText'
import EllipsisMiddle from '../../EllipsisMiddle'
import { ReactComponent as UsedSeal } from './used-seal.svg'
import { ReactComponent as NewSeal } from './new-seal.svg'
import { ReactComponent as ViewNewSeal } from './view-new-seal.svg'
import { ReactComponent as BtcIcon } from './btc.svg'
import { ReactComponent as DirectionIcon } from '../../../assets/direction.svg'

const BtcTransaction: FC<{ tx: RawBtcRPC.BtcTx; showId?: boolean }> = ({ tx, showId = true }) => {
  const { t } = useTranslation()

  const time = dayjs(tx.blocktime * 1000)
  return (
    <div className={styles.container}>
      <BtcIcon className={styles.btcIcon} />
      {showId ? (
        <div className={styles.header}>
          <h3 className={styles.txid}>
            <a
              href={`${config.BITCOIN_EXPLORER}/tx/${tx.txid}`}
              title={tx.txid}
              rel="noopener noreferrer"
              target="_blank"
            >
              <EllipsisMiddle className="monospace" text={tx.txid} />
            </a>
          </h3>
          <time dateTime={time.toISOString()}>{`${tx.confirmations.toLocaleString('en')} Confirmations (${time.format(
            'YYYY-MM-DD hh:mm:ss',
          )})`}</time>
        </div>
      ) : null}
      <div className={styles.utxos}>
        <div className={styles.inputs}>
          {tx.vin.map((input, idx) => {
            if (!input.prevout) return null
            const key = `${input?.txid}-${idx}`
            const [int, dec] = input.prevout.value.toString().split('.')
            return (
              <div key={key} className={styles.input}>
                <a href={`${config.BITCOIN_EXPLORER}/tx/${input.txid}`} rel="noopener noreferrer" target="_blank">
                  <AddressText className="monospace">{input.prevout.scriptPubKey.address}</AddressText>
                </a>
                <div className={`${styles.btcAttr} monospace`}>
                  <div className={styles.btcValue}>
                    <span>{int}</span>
                    {dec ? <span>{`.${dec}`}</span> : null}
                  </div>
                  BTC
                  {input.prevout.scriptPubKey.asm && !idx ? (
                    <Tooltip
                      placement="top"
                      title={t('transaction.isomorphic-binding-with-index', {
                        index: `Input #${idx}`,
                        commitment: input.prevout.scriptPubKey.asm,
                      })}
                    >
                      <UsedSeal />
                    </Tooltip>
                  ) : (
                    <div className={styles.iconPlaceholder} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <DirectionIcon className={styles.direction} />
        <div className={styles.outputs}>
          {tx.vout.map((output, idx) => {
            const key = `${output?.scriptPubKey?.address}-${idx}`
            const [int, dec] = output.value.toString().split('.')
            return (
              <div key={key} className={styles.output}>
                <a
                  href={`${config.BITCOIN_EXPLORER}/address/${output.scriptPubKey.address}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AddressText className="monospace">{output.scriptPubKey.address}</AddressText>
                </a>
                <div className={`${styles.btcAttr} monospace`}>
                  <div className={styles.btcValue}>
                    <span>{int}</span>
                    {dec ? <span>{`.${dec}`}</span> : null}
                  </div>
                  BTC
                  {output.scriptPubKey.asm && !idx ? (
                    <Tooltip
                      placement="top"
                      title={t('transaction.isomorphic-binding-with-index', {
                        index: `Output #${idx}`,
                        commitment: output.scriptPubKey.asm,
                      })}
                    >
                      <div className={styles.newSeal}>
                        <NewSeal />
                        <ViewNewSeal />
                      </div>
                    </Tooltip>
                  ) : (
                    <div className={styles.iconPlaceholder} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BtcTransaction
