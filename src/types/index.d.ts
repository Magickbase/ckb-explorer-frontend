declare namespace State {
  import { Cell } from '../models/Cell'

  export interface TransactionLiteDetails {
    address: string
    transfers: LiteTransfer[]
  }

  interface LiteTransfer {
    capacity: string
    cellType: Cell['cellType']

    udtInfo?: {
      symbol: string
      amount: string
      decimal: string
      typeHash: string
      published: boolean
      displayName: string
      uan: string
    }

    mNftInfo?: {
      className: string
      tokenId: string // none 0x prefix hex number
      total: string // decimal string
    }
  }

  export interface NervosDao {
    totalDeposit: string
    depositorsCount: string
    depositChanges: string
    unclaimedCompensationChanges: string
    claimedCompensationChanges: string
    depositorChanges: string
    unclaimedCompensation: string
    claimedCompensation: string
    averageDepositTime: string
    miningReward: string
    depositCompensation: string
    treasuryAmount: string
    estimatedApc: string
  }

  export interface NervosDaoDepositor {
    addressHash: string
    daoDeposit: number
    averageDepositTime: string
  }

  export interface Statistics {
    tipBlockNumber: string
    averageBlockTime: string
    currentEpochDifficulty: string
    hashRate: string
    epochInfo: {
      epochNumber: string
      epochLength: string
      index: string
    }
    estimatedEpochTime: string
    transactionsLast24Hrs: string
    transactionsCountPerMinute: string
    reorgStartedAt: string | null
  }

  interface FetchStatusValue {
    OK: string
    Error: string
    InProgress: string
    None: string
  }

  export type FetchStatus = keyof FetchStatusValue

  export type TransactionCsvExportType = 'address_transactions' | 'blocks' | 'udts' | 'nft'

  export interface ChartColor {
    areaColor: string
    colors: string[]
    moreColors: string[]
    totalSupplyColors: string[]
    daoColors: string[]
    secondaryIssuanceColors: string[]
    liquidityColors: string[]
  }

  type Theme = { primary: string }
}
