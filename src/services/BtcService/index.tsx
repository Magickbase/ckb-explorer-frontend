import axios from 'axios'
import config from '../../config'
import { explorerService } from '../ExplorerService'

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

export const getTxsByCkbTxHashes = async (hashList: string[]) => {
  const digestList = await Promise.allSettled(hashList.map(hash => explorerService.api.fetchRGBDigest(hash)))
  const idList: string[] = digestList
    .map(res => (res.status === 'fulfilled' ? res.value.data.txid : ''))
    .filter(id => id)
  return getTxList(idList)
}
