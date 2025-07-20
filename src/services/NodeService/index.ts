import { ccc } from '@ckb-ccc/core'
import { toCamelcase } from '../../utils/util'

export class NodeService {
  nodeEndpoint: string
  public rpc: ccc.Client

  constructor(nodeEndpoint: string) {
    this.nodeEndpoint = nodeEndpoint
    this.rpc = new ccc.ClientPublicMainnet({
      url: nodeEndpoint,
    })
  }

  async getBlockEconomicState(blockHash: string): Promise<CKBComponents.BlockEconomicState> {
    const body = {
      id: 1,
      jsonrpc: '2.0',
      method: 'get_block_economic_state',
      params: [blockHash],
    }

    return fetch(this.rpc.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(res => toCamelcase(res.result) as CKBComponents.BlockEconomicState)
  }

  async getBlockchainInfo(): Promise<CKBComponents.BlockchainInfo> {
    const body = {
      id: 1,
      jsonrpc: '2.0',
      method: 'get_blockchain_info',
      params: [],
    }

    return fetch(this.rpc.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(res => toCamelcase(res.result) as CKBComponents.BlockchainInfo)
  }

  async getConsensus(): Promise<CKBComponents.Consensus> {
    const body = {
      id: 1,
      jsonrpc: '2.0',
      method: 'get_consensus',
      params: [],
    }

    return fetch(this.rpc.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(res => toCamelcase(res.result) as CKBComponents.Consensus)
  }

  async getTx(hash: string) {
    return this.rpc.getTransaction(hash)
  }

  async sendTransaction(tx: ccc.Transaction) {
    return this.rpc.sendTransaction(tx)
  }

  async getCellByOutPoint(outPoint: ccc.OutPointLike): Promise<ccc.Cell | undefined> {
    const res = await this.getTx(outPoint.txHash.toString())

    if (!res) {
      return undefined
    }

    const { transaction } = res

    return ccc.Cell.from({
      cellOutput: transaction.outputs[parseInt(outPoint.index.toString(), 10)],
      outputData: transaction.outputsData[parseInt(outPoint.index.toString(), 10)],
      outPoint,
    })
  }

  async getInputCells(outPoints: ccc.OutPointLike[]): Promise<ccc.Cell[]> {
    const cells = await Promise.all(outPoints.map(outPoint => this.getCellByOutPoint(outPoint)))
    return cells.filter(i => i) as ccc.Cell[]
  }
}

export namespace NodeRpc {
  export enum TransactionStatus {
    Pending = 'pending',
    Proposed = 'proposed',
    Committed = 'committed',
    Unknown = 'unknown',
    Rejected = 'rejected',
  }

  export type TransactionWithStatus = ccc.ClientTransactionResponse
}
