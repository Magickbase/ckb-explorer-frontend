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

const mock = [
  {
    txid: 'af44283741dfbff62c2db6c22aebe0198e31d78de404ed1150cedc3944766b35',
    hash: 'af44283741dfbff62c2db6c22aebe0198e31d78de404ed1150cedc3944766b35',
    vin: [
      {
        txid: '6afb73d9b68c639513cece94f42441cf0754f7413d7b6a1eaaae8b07118ecc1f',
        prevout: {
          value: 12.74031099,
          scriptPubKey: {
            asm: 'OP_DUP OP_HASH160 02562c9496d8c406511e6e8e919b78aa9dfdc2e6 OP_EQUALVERIFY OP_CHECKSIG',
            address: '1DMasM52t5HyY2YpYubwhf8kCwoYuRvfz',
          },
        },
      },
    ],
    vout: [
      {
        value: 12.47731099,
        scriptPubKey: {
          asm: 'OP_DUP OP_HASH160 3fc4883806ba807f6325d36238f9c07876fbc52a OP_EQUALVERIFY OP_CHECKSIG',
          address: '16pB1NmhoJaDUVPCc8nmMMtijT31FvGQyj',
        },
      },
      {
        value: 0.262,
        scriptPubKey: {
          asm: 'OP_HASH160 61fb06453db2a77a47aa96aec4e7d1f17693c53d OP_EQUAL',
          address: '3Ad6Be1aaZ6sdsBHCh1exVPY6bkWswNBde',
        },
      },
    ],
    fee: 0.001,
    hex: '01000000011fcc8e11078baeaa1e6a7b3d41f75407cf4124f494cece1395638cb6d973fb6a000000006b483045022100c83055b06bc73e6a2de27a8a70c20da34ad0b7679ed46065cdf28c4e8ba3c7e80220557e2ef287f4f48b44d1a2efff4da9293085d595ec670ad7802dca12fa4cce12012103ec620a59b54f6f70c43f02590c0d92d4362bc76e4dabff155cc41f36d2a9b12effffffff029bdd5e4a000000001976a9143fc4883806ba807f6325d36238f9c07876fbc52a88acc0c78f010000000017a91461fb06453db2a77a47aa96aec4e7d1f17693c53d8700000000',
    blockhash: '00000000000000000001e6a1e74d0143975b1edb524a5f72150852f257c306cd',
    confirmations: 202776,
    time: 1591123661,
    blocktime: 1591123661,
  },
]

const BtcTransaction: FC<{ hash: string; showId: boolean }> = ({ hash, showId }) => {
  const { data, isFetching } = useQuery(['btc-tx', hash], () => getTxsByCkbTxHashes([hash]), {
    enabled: false,
  })

  const btcTx = data?.[0] ?? mock[0]
  if (!isFetching && !btcTx) {
    return (
      <div>
        <SmallLoading />
      </div>
    )
  }
  if (!btcTx) {
    return <div>No Record</div>
  }
  // const rowLength = btcTx.vin.length > btcTx.vout.length ? btcTx.vin.length : btcTx.vout.length
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
