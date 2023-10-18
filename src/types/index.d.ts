declare namespace State {
  import { Script } from '../models/Script'

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

  export interface LockInfo {
    status: 'locked' | 'unlocked'
    epochNumber: string
    epochIndex: string
    estimatedUnlockTime: string
  }

  export interface SUDT {
    symbol: string
    decimal: string
    amount: string
    typeHash: string
    udtIconFile: string
    uan?: string
    udtType: 'sudt'
    collection: undefined
    cota: undefined
  }

  interface MNFT {
    symbol: string
    decimal: string
    amount: string
    typeHash: string
    udtIconFile: string
    udtType: 'm_nft_token'
    uan: undefined
    collection: {
      typeHash: string
    }
    cota: undefined
  }

  interface NRC721 {
    symbol: string
    amount: string // token id in fact
    typeHash: string
    udtIconFile: string // base uri with token id in fact
    udtType: 'nrc_721_token'
    uan: undefined
    collection: {
      typeHash: string
    }
    cota: undefined
  }

  interface CoTA {
    symbol: string
    amount: string
    typeHash: string
    udtIconFile: string // base uri with token id in fact
    udtType: 'cota'
    uan: undefined
    collection: undefined
    cota: {
      cotaId: number
      tokenId: number
    }
  }

  interface Spore {
    symbol?: string
    amount: string
    typeHash: string
    udtIconFile: string
    udtType: 'spore_cell'
    collection: {
      typeHash: string | null
    }
    uan: undefined
    cota: undefined
  }

  export type UDTAccount = SUDT | MNFT | NRC721 | CoTA | Spore

  export interface Address {
    addressHash: string
    lockHash: string
    balance: string
    balanceOccupied: string
    transactionsCount: number
    lockScript: Script
    pendingRewardBlocksCount: number
    type: 'Address' | 'LockHash' | ''
    daoDeposit: number
    interest: number
    daoCompensation: number
    lockInfo: LockInfo
    liveCellsCount: string
    minedBlocksCount: string
    isSpecial: boolean
    specialAddress: string
    udtAccounts?: Array<UDTAccount>
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

  export interface StatisticTransactionCount {
    transactionsCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticAddressCount {
    addressesCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticTotalDaoDeposit {
    totalDaoDeposit: string
    totalDepositorsCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticNewDaoDeposit {
    dailyDaoDeposit: string
    dailyDaoDepositorsCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticNewDaoWithdraw {
    dailyDaoWithdraw: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticCirculationRatio {
    circulationRatio: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticDifficultyHashRate {
    difficulty: string
    uncleRate: string
    hashRate: string
    epochNumber: string
  }

  export interface StatisticDifficulty {
    avgDifficulty: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticHashRate {
    avgHashRate: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticUncleRate {
    uncleRate: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticCellCount {
    liveCellsCount: string
    deadCellsCount: string
    allCellsCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticDifficultyUncleRateEpoch {
    epochNumber: string
    epochTime: string
    epochLength: string
  }

  export interface StatisticAddressBalanceRank {
    ranking: string
    address: string
    balance: string
  }

  export interface StatisticAddressBalanceRanking {
    addressBalanceRanking: StatisticAddressBalanceRank[]
  }

  export interface StatisticAddressBalanceDistribution {
    addressBalanceDistribution: string[][]
  }

  export interface StatisticBalanceDistribution {
    balance: string
    addresses: string
    sumAddresses: string
  }

  export interface StatisticTransactionFee {
    totalTxFee: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticBlockTimeDistributions {
    blockTimeDistribution: string[][]
  }

  export interface StatisticBlockTimeDistribution {
    time: string
    ratio: string
  }

  export interface StatisticAverageBlockTime {
    timestamp: number
    avgBlockTimeDaily: string
    avgBlockTimeWeekly: string
  }

  export interface StatisticAverageBlockTimes {
    averageBlockTime: StatisticAverageBlockTime[]
  }

  export interface StatisticOccupiedCapacity {
    occupiedCapacity: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticEpochTimeDistributions {
    epochTimeDistribution: string[][]
  }

  export interface StatisticEpochTimeDistribution {
    time: string
    epoch: string
  }

  export interface StatisticNewNodeCount {
    nodesCount: string
    createdAtUnixtimestamp: string
  }

  export interface StatisticNodeDistribution {
    name: string
    value: number[]
  }

  export interface StatisticNodeDistributions {
    nodesDistribution: {
      city: string
      count: number
      postal: string
      country: string
      latitude: string
      longitude: string
    }[]
  }

  export interface StatisticTotalSupply {
    createdAtUnixtimestamp: string
    circulatingSupply: string
    burnt: string
    lockedCapacity: string
  }

  export interface StatisticAnnualPercentageCompensation {
    year: number
    apc: string
  }

  export interface StatisticAnnualPercentageCompensations {
    nominalApc: string[]
  }

  export interface StatisticSecondaryIssuance {
    createdAtUnixtimestamp: string
    treasuryAmount: string
    miningReward: string
    depositCompensation: string
  }

  export interface StatisticInflationRates {
    nominalApc: string[]
    nominalInflationRate: string[]
    realInflationRate: string[]
  }

  export interface StatisticInflationRate {
    year: number
    nominalApc: string
    nominalInflationRate: string
    realInflationRate: string
  }

  export interface StatisticLiquidity {
    createdAtUnixtimestamp: string
    circulatingSupply: string
    liquidity: string
    daoDeposit: string
  }

  export interface StatisticMinerAddressDistribution {
    minerAddressDistribution: Record<string, string>
  }

  export interface StatisticMinerAddress {
    address: string
    radio: string
  }

  export interface StatisticCacheInfo {
    flushCacheInfo: string[]
  }

  interface FetchStatusValue {
    OK: string
    Error: string
    InProgress: string
    None: string
  }

  export type FetchStatus = keyof FetchStatusValue

  export interface UDT {
    symbol: string
    fullName: string
    iconFile: string
    published: boolean
    description: string
    totalAmount: string
    addressesCount: string
    decimal: string
    h24CkbTransactionsCount: string
    createdAt: string
    typeHash: string
    issuerAddress: string
    typeScript: Script
    displayName?: string
    uan?: string
  }

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
