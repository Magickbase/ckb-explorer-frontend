import axios from 'axios'
import config from '../../config'

const { BITCOIN_NODES: bitcoinNodes } = config

const node = bitcoinNodes[0]

interface Utxo {
  value: number
  scriptPubKey: {
    asm: string
    address: string
  }
}

interface Vin {
  txid: string
  prevout: Utxo
}

interface Vout extends Utxo {}

interface BtcTx {
  txid: string
  hash: string
  vin: Vin[]
  vout: Vout[]
  blocktime: number
  confirmations: number
}

if (!node) {
  throw new Error('Bitcoin NodeService not implemented')
}

export const getTx = async (id: string): Promise<BtcTx> => {
  const body = {
    method: 'getrawtransaction',
    params: [id, 2],
  }

  return axios
    .post(node, body)
    .then(res => res.data.result)
    .catch(() => null)
}

export const getTxList = async (idList: string[]): Promise<BtcTx[]> => {
  const body = idList.map((id, i) => ({
    method: 'getrawtransaction',
    params: [id, 2],
    id: i,
  }))

  return axios
    .post(node, body)
    .then(res => res.data.map((r: { result: object }) => r.result))
    .catch(() => null)
}
