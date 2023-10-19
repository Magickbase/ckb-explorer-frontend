import { CellInScript, CkbTransactionInScript } from '../pages/Script/types'

export const transformToTransaction = (tx: CkbTransactionInScript): State.Transaction => {
  return {
    transactionHash: tx.txHash,
    blockNumber: tx.blockNumber,
    blockTimestamp: tx.blockTimestamp,
    transactionFee: String(tx.transactionFee),
    isCellbase: tx.isCellbase,
    displayInputs: tx.displayInputs,
    displayOutputs: tx.displayOutputs,
    txStatus: tx.txStatus,

    // defaults
    income: '',
    targetBlockNumber: 0,
    version: 0,
    cellDeps: [],
    headerDeps: [],
    witnesses: [],
    liveCellChanges: '',
    capacityInvolved: '',
    detailedMessage: '',
    bytes: 0,
    largestTxInEpoch: 0,
    largestTx: 0,
    cycles: null,
    maxCyclesInEpoch: null,
    maxCycles: null,
  }
}

export type CellBasicInfo = Pick<State.Cell, 'id' | 'isGenesisOutput' | 'capacity'>
export const transformToCellBasicInfo = (cell: CellInScript): CellBasicInfo => {
  return {
    id: cell.id,
    capacity: cell.capacity,
    isGenesisOutput: false,
  }
}
