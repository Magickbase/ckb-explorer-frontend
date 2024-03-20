import type { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tooltip } from 'antd'
import SmallLoading from '../../Loading/SmallLoading'
import { getTxsByCkbTxHashes } from '../../../services/BtcService'
import config from '../../../config'
import styles from './styles.module.scss'
import AddressText from '../../AddressText'
import EllipsisMiddle from '../../EllipsisMiddle'
import { ReactComponent as UsedSeal } from './used-seal.svg'
import { ReactComponent as NewSeal } from './new-seal.svg'
import { ReactComponent as ViewNewSeal } from './view-new-seal.svg'

const BtcTransaction: FC<{ hash: string; showId?: boolean }> = ({ hash, showId = true }) => {
  const { data, isFetching } = useQuery(['btc-tx', hash], () => getTxsByCkbTxHashes([hash]), {
    enabled: !!hash,
  })

  const btcTx = data?.[0]
  if (isFetching) {
    return (
      <div>
        <SmallLoading />
      </div>
    )
  }
  if (!btcTx) {
    return <div>No Record</div>
  }
  return (
    <div className={styles.container}>
      {showId ? (
        <h3 className={styles.txid}>
          <span>BTC TX ID:</span>
          <a
            href={`${config.BITCOIN_EXPLORER}/tx/${btcTx.txid}`}
            title={btcTx.txid}
            rel="noopener noreferrer"
            target="_blank"
          >
            <EllipsisMiddle className="monospace" text={btcTx.txid} />
          </a>
        </h3>
      ) : null}
      <div className={styles.utxos}>
        <div className={styles.inputs}>
          <h5>Inputs</h5>
          {btcTx.vin.map((input, idx) => {
            if (!input.prevout) return null
            const key = `${input?.txid}-${idx}`
            return (
              <div key={key} className={styles.input}>
                <a href={`${config.BITCOIN_EXPLORER}/tx/${input.txid}`} rel="noopener noreferrer" target="_blank">
                  <AddressText className="monospace">{input.prevout.scriptPubKey.address}</AddressText>
                </a>
                <div className={`${styles.btcAttr} monospace`}>
                  {input.prevout.value} BTC
                  {input.prevout.scriptPubKey.asm ? (
                    <Tooltip placement="top" title={input.prevout.scriptPubKey.asm}>
                      <UsedSeal />
                    </Tooltip>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
        <div className={styles.outputs}>
          <h5>Outputs</h5>
          {btcTx.vout.map((output, idx) => {
            const key = `${output?.scriptPubKey?.address}-${idx}`
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
                  {output.value} BTC
                  {output.scriptPubKey.asm ? (
                    <Tooltip placement="top" title={output.scriptPubKey.asm}>
                      <div className={styles.newSeal}>
                        <NewSeal />
                        <ViewNewSeal />
                      </div>
                    </Tooltip>
                  ) : null}
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
