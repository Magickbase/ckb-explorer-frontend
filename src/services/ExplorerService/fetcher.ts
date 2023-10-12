import { AxiosResponse } from 'axios'
import BigNumber from 'bignumber.js'
import { Dayjs } from 'dayjs'
import { ReactNode } from 'react'
import { pick } from '../../utils/object'
import { toCamelcase } from '../../utils/util'
import { requesterV1, requesterV2 } from './requester'
import { Response } from './types'

async function v1Get<T>(...args: Parameters<typeof requesterV1.get>) {
  return requesterV1.get(...args).then(res => toCamelcase<Response.Response<T>>(res.data))
}

const v1GetWrapped = <T>(...args: Parameters<typeof v1Get>) => v1Get<Response.Wrapper<T>>(...args).then(res => res.data)

const v1GetNullableWrapped = <T>(...args: Parameters<typeof v1Get>) =>
  v1Get<Response.Wrapper<T> | null>(...args).then(res => res.data)

const v1GetUnwrapped = <T>(...args: Parameters<typeof v1GetWrapped>) =>
  v1GetWrapped<T>(...args).then(wrapper => wrapper.attributes)

export const apiFetcher = {
  fetchBlocks: (page: number, size: number, sort?: string) =>
    v1Get<Response.Wrapper<State.Block>[]>('blocks', {
      params: {
        page,
        page_size: size,
        sort,
      },
    }),

  fetchLatestBlocks: (size: number) => apiFetcher.fetchBlocks(1, size),

  fetchAddressInfo: (address: string) => v1GetWrapped<State.Address>(`addresses/${address}`),

  fetchTransactionsByAddress: (address: string, page: number, size: number, sort?: string, txTypeFilter?: string) =>
    v1Get<Response.Wrapper<State.Transaction>[]>(`address_transactions/${address}`, {
      params: {
        page,
        page_size: size,
        sort,
        tx_type: txTypeFilter,
      },
    }),

  fetchTransactionRaw: (hash: string) => requesterV2.get<unknown>(`transactions/${hash}/raw`).then(res => res.data),

  fetchTransactionByHash: (hash: string) => v1GetWrapped<State.Transaction>(`transactions/${hash}`),

  fetchTransactionLiteDetailsByHash: (hash: string) =>
    requesterV2
      .get(`ckb_transactions/${hash}/details`)
      .then((res: AxiosResponse) => toCamelcase<Response.Response<State.TransactionLiteDetails[]>>(res.data)),

  fetchTransactions: (page: number, size: number, sort?: string) =>
    v1Get<Response.Wrapper<State.Transaction>[]>('transactions', {
      params: {
        page,
        page_size: size,
        sort,
      },
    }),

  fetchLatestTransactions: (size: number) => apiFetcher.fetchTransactions(1, size),

  fetchPendingTransactions: (page: number, size: number, sort?: string) =>
    requesterV2
      .get('pending_transactions', {
        params: {
          page,
          page_size: size,
          sort,
        },
      })
      .then(res => toCamelcase<Response.Response<State.Transaction[]>>(res.data)),

  fetchPendingTransactionsCount: () => apiFetcher.fetchPendingTransactions(1, 1).then(resp => resp.meta?.total),

  fetchTransactionsByBlockHash: (
    blockHash: string,
    {
      page,
      size: page_size,
      filter,
    }: Partial<{
      page: number
      size: number
      filter: string | null
    }>,
  ) =>
    v1Get<Response.Wrapper<State.Transaction>[]>(`/block_transactions/${blockHash}`, {
      params: {
        page,
        page_size,
        address_hash: filter?.startsWith('ck') ? filter : null,
        tx_hash: filter?.startsWith('0x') ? filter : null,
      },
    }),

  fetchBlock: (blockHeightOrHash: string) => v1GetWrapped<State.Block>(`blocks/${blockHeightOrHash}`),

  fetchScript: (scriptType: 'lock_scripts' | 'type_scripts', id: string) =>
    v1GetNullableWrapped<State.Script>(`/cell_output_${scriptType}/${id}`),

  fetchCellData: (id: string) =>
    v1Get<Response.Wrapper<State.Data> | null>(`/cell_output_data/${id}`).then(res => res.data),

  fetchSearchResult: (param: string) =>
    requesterV1
      .get('suggest_queries', {
        params: {
          q: param,
        },
      })
      .then((res: AxiosResponse) => toCamelcase<any>(res.data)),

  fetchStatistics: () => v1GetWrapped<State.Statistics>(`statistics`),

  fetchTipBlockNumber: () => v1GetWrapped<Pick<State.Statistics, 'tipBlockNumber'>>('statistics/tip_block_number'),

  fetchBlockchainInfo: () => v1GetWrapped<State.BlockchainInfo>('statistics/blockchain_info'),

  fetchNodeVersion: () => v1GetWrapped<State.NodeVersion>('/nets/version'),

  fetchNervosDao: () => v1GetWrapped<State.NervosDao>(`contracts/nervos_dao`),

  // Unused currently
  fetchNervosDaoTransactions: (page: number, size: number) =>
    v1Get<Response.Wrapper<State.Transaction>[]>(`contract_transactions/nervos_dao`, {
      params: {
        page,
        page_size: size,
      },
    }),

  // Unused currently
  fetchNervosDaoTransactionsByHash: (hash: string) =>
    v1GetWrapped<State.Transaction>(`dao_contract_transactions/${hash}`),

  // Unused currently
  fetchNervosDaoTransactionsByAddress: (address: string, page: number, size: number) =>
    v1Get<Response.Wrapper<State.Transaction>[]>(`address_dao_transactions/${address}`, {
      params: {
        page,
        page_size: size,
      },
    }),

  fetchNervosDaoTransactionsByFilter: ({ page, size, filter }: { page: number; size: number; filter?: string }) =>
    v1Get<Response.Wrapper<State.Transaction>[]>(`contract_transactions/nervos_dao`, {
      params: {
        page,
        page_size: size,
        tx_hash: filter?.startsWith('0x') ? filter : null,
        address_hash: filter?.startsWith('0x') ? null : filter,
      },
    }),

  fetchNervosDaoDepositors: () => v1Get<Response.Wrapper<State.NervosDaoDepositor>[]>(`/dao_depositors`),

  fetchStatisticTransactionCount: () =>
    v1Get<Response.Wrapper<State.StatisticTransactionCount>[]>(`/daily_statistics/transactions_count`).then(resp => {
      return {
        ...resp,
        // filter latest exceptional data out
        data: resp.data.filter((item, idx) => idx < resp.data.length - 2 || item.attributes.transactionsCount !== '0'),
      }
    }),

  fetchStatisticAddressCount: () =>
    v1Get<Response.Wrapper<State.StatisticAddressCount>[]>(`/daily_statistics/addresses_count`).then(resp => {
      return {
        ...resp,
        // filter latest exceptional data out
        data: resp.data.filter((item, idx) => idx < resp.data.length - 2 || item.attributes.addressesCount !== '0'),
      }
    }),

  fetchStatisticTotalDaoDeposit: () =>
    v1Get<Response.Wrapper<State.StatisticTotalDaoDeposit>[]>(
      '/daily_statistics/total_depositors_count-total_dao_deposit',
    ),

  fetchStatisticNewDaoDeposit: () =>
    v1Get<Response.Wrapper<State.StatisticNewDaoDeposit>[]>(
      '/daily_statistics/daily_dao_deposit-daily_dao_depositors_count',
    ),

  fetchStatisticNewDaoWithdraw: () =>
    v1Get<Response.Wrapper<State.StatisticNewDaoWithdraw>[]>('/daily_statistics/daily_dao_withdraw'),

  fetchStatisticCirculationRatio: () =>
    v1Get<Response.Wrapper<State.StatisticCirculationRatio>[]>('/daily_statistics/circulation_ratio'),

  fetchStatisticDifficultyHashRate: () =>
    v1Get<Response.Wrapper<State.StatisticDifficultyHashRate>[]>(
      `/epoch_statistics/difficulty-uncle_rate-hash_rate`,
    ).then(resp => {
      return {
        ...resp,
        data: resp.data
          // filter latest exceptional data out
          .filter((item, idx) => idx < resp.data.length - 2 || item.attributes.hashRate !== '0.0')
          .map(wrapper => ({
            ...wrapper,
            attributes: {
              // Data may enter the cache, so it is purify to reduce volume.
              ...pick(wrapper.attributes, ['difficulty', 'epochNumber']),
              uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
              hashRate: new BigNumber(wrapper.attributes.hashRate).multipliedBy(1000).toString(),
            },
          })),
      }
    }),

  fetchStatisticDifficulty: () =>
    v1Get<Response.Wrapper<State.StatisticDifficulty>[]>(`/daily_statistics/avg_difficulty`).then(resp => {
      return {
        ...resp,
        // filter latest exceptional data out
        data: resp.data.filter((item, idx) => idx < resp.data.length - 2 || item.attributes.avgDifficulty !== '0.0'),
      }
    }),

  fetchStatisticHashRate: () =>
    v1Get<Response.Wrapper<State.StatisticHashRate>[]>(`/daily_statistics/avg_hash_rate`).then(resp => {
      return {
        ...resp,
        data: resp.data
          // filter latest exceptional data out
          .filter((item, idx) => idx < resp.data.length - 2 || item.attributes.avgHashRate !== '0.0')
          .map(wrapper => ({
            ...wrapper,
            attributes: {
              ...wrapper.attributes,
              avgHashRate: new BigNumber(wrapper.attributes.avgHashRate).multipliedBy(1000).toString(),
            },
          })),
      }
    }),

  fetchStatisticUncleRate: () =>
    v1Get<Response.Wrapper<State.StatisticUncleRate>[]>(`/daily_statistics/uncle_rate`).then(resp => {
      return {
        ...resp,
        data: resp.data
          // filter latest exceptional data out
          .filter((item, idx) => idx < resp.data.length - 2 || item.attributes.uncleRate !== '0')
          .map(wrapper => ({
            ...wrapper,
            attributes: {
              ...wrapper.attributes,
              uncleRate: new BigNumber(wrapper.attributes.uncleRate).toFixed(4),
            },
          })),
      }
    }),

  fetchStatisticMinerAddressDistribution: () =>
    v1GetWrapped<State.StatisticMinerAddressDistribution>(`/distribution_data/miner_address_distribution`),

  fetchStatisticMinerVersionDistribution: () =>
    requesterV2(`/blocks/ckb_node_versions`).then((res: AxiosResponse) =>
      toCamelcase<{ data: Array<{ version: string; blocksCount: number }> }>(res.data),
    ),

  fetchStatisticTransactionFees: () =>
    requesterV2
      .get('statistics/transaction_fees')
      .then(res => toCamelcase<FeeRateTracker.TransactionFeesStatistic>(res.data)),

  fetchStatisticCellCount: (): Promise<Response.Response<Response.Wrapper<State.StatisticCellCount>[]>> =>
    v1Get<Response.Wrapper<Omit<State.StatisticCellCount, 'allCellsCount'>>[]>(
      `/daily_statistics/live_cells_count-dead_cells_count`,
    ).then(resp => {
      return {
        ...resp,
        data: resp.data.map(wrapper => ({
          ...wrapper,
          attributes: {
            ...wrapper.attributes,
            allCellsCount: (
              Number(wrapper.attributes.liveCellsCount) + Number(wrapper.attributes.deadCellsCount)
            ).toString(),
          },
        })),
      }
    }),

  fetchStatisticDifficultyUncleRateEpoch: () =>
    v1Get<Response.Wrapper<State.StatisticDifficultyUncleRateEpoch>[]>(
      `/epoch_statistics/epoch_time-epoch_length`,
    ).then(resp => {
      return {
        ...resp,
        data: resp.data.map(wrapper => ({
          ...wrapper,
          // Data may enter the cache, so it is purify to reduce volume.
          attributes: pick(wrapper.attributes, ['epochNumber', 'epochTime', 'epochLength']),
        })),
      }
    }),

  fetchStatisticAddressBalanceRank: () =>
    v1GetWrapped<State.StatisticAddressBalanceRanking>(`/statistics/address_balance_ranking`),

  fetchStatisticBalanceDistribution: () =>
    v1GetWrapped<State.StatisticAddressBalanceDistribution>(`/distribution_data/address_balance_distribution`),

  fetchStatisticTxFeeHistory: () =>
    v1Get<Response.Wrapper<State.StatisticTransactionFee>[]>(`/daily_statistics/total_tx_fee`),

  fetchStatisticBlockTimeDistribution: () =>
    v1GetWrapped<State.StatisticBlockTimeDistributions>(`/distribution_data/block_time_distribution`),

  fetchStatisticAverageBlockTimes: () =>
    v1GetUnwrapped<State.StatisticAverageBlockTimes>(`/distribution_data/average_block_time`).then(
      res => res.averageBlockTime,
    ),

  fetchStatisticOccupiedCapacity: () =>
    v1Get<Response.Wrapper<State.StatisticOccupiedCapacity>[]>(`/daily_statistics/occupied_capacity`),

  fetchStatisticEpochTimeDistribution: () =>
    v1GetWrapped<State.StatisticEpochTimeDistributions>(`/distribution_data/epoch_time_distribution`),

  fetchStatisticNewNodeCount: () =>
    v1Get<Response.Wrapper<State.StatisticNewNodeCount>[]>(`/daily_statistics/nodes_count`),

  fetchStatisticNodeDistribution: () =>
    v1GetWrapped<State.StatisticNodeDistributions>(`/distribution_data/nodes_distribution`),

  fetchStatisticTotalSupply: () =>
    v1Get<Response.Wrapper<State.StatisticTotalSupply>[]>(`/daily_statistics/circulating_supply-burnt-locked_capacity`),

  fetchStatisticAnnualPercentageCompensation: () =>
    v1GetWrapped<State.StatisticAnnualPercentageCompensations>(`/monetary_data/nominal_apc`),

  fetchStatisticSecondaryIssuance: () =>
    v1Get<Response.Wrapper<State.StatisticSecondaryIssuance>[]>(
      `/daily_statistics/treasury_amount-mining_reward-deposit_compensation`,
    ).then(resp => {
      return {
        ...resp,
        data: resp.data.map(wrapper => {
          const { depositCompensation, miningReward, treasuryAmount } = wrapper.attributes
          const sum = Number(treasuryAmount) + Number(miningReward) + Number(depositCompensation)
          const treasuryAmountPercent = Number(((Number(treasuryAmount) / sum) * 100).toFixed(2))
          const miningRewardPercent = Number(((Number(miningReward) / sum) * 100).toFixed(2))
          const depositCompensationPercent = (100 - treasuryAmountPercent - miningRewardPercent).toFixed(2)
          return {
            ...wrapper,
            attributes: {
              ...wrapper.attributes,
              treasuryAmount: treasuryAmountPercent.toString(),
              miningReward: miningRewardPercent.toString(),
              depositCompensation: depositCompensationPercent,
            },
          }
        }),
      }
    }),

  fetchStatisticInflationRate: () =>
    v1GetWrapped<State.StatisticInflationRates>(
      `/monetary_data/nominal_apc50-nominal_inflation_rate-real_inflation_rate`,
    ),

  fetchStatisticLiquidity: () =>
    v1Get<Response.Wrapper<State.StatisticLiquidity>[]>(`/daily_statistics/circulating_supply-liquidity`).then(resp => {
      return {
        ...resp,
        data: resp.data.map(wrapper => ({
          ...wrapper,
          attributes: {
            ...wrapper.attributes,
            daoDeposit: new BigNumber(wrapper.attributes.circulatingSupply)
              .minus(new BigNumber(wrapper.attributes.liquidity))
              .toFixed(2),
          },
        })),
      }
    }),

  fetchFlushChartCache: () => v1GetWrapped<State.StatisticCacheInfo>(`statistics/flush_cache_info`),

  fetchSimpleUDT: (typeHash: string) => v1GetWrapped<State.UDT>(`/udts/${typeHash}`),

  fetchSimpleUDTTransactions: ({
    typeHash,
    page,
    size,
    filter,
    type,
  }: {
    typeHash: string
    page: number
    size: number
    filter?: string | null
    type?: string | null
  }) =>
    v1Get<Response.Wrapper<State.Transaction>[]>(`/udt_transactions/${typeHash}`, {
      params: {
        page,
        page_size: size,
        address_hash: filter?.startsWith('0x') ? undefined : filter,
        tx_hash: filter?.startsWith('0x') ? filter : undefined,
        transfer_action: type,
      },
    }),

  fetchTokens: (page: number, size: number, sort?: string) =>
    v1Get<Response.Wrapper<State.UDT>[]>(`/udts`, {
      params: {
        page,
        page_size: size,
        sort,
      },
    }),

  exportTransactions: ({
    type,
    id,
    date,
    block,
  }: {
    type: State.TransactionCsvExportType
    id?: string
    date?: Record<'start' | 'end', Dayjs | undefined>
    block?: Record<'from' | 'to', number>
  }) => {
    const rangeParams = {
      start_date: date?.start?.valueOf(),
      end_date: date?.end?.add(1, 'day').subtract(1, 'millisecond').valueOf(),
      start_number: block?.from,
      end_number: block?.to,
    }
    if (type === 'nft') {
      return requesterV2
        .get(`/nft/transfers/download_csv`, { params: { ...rangeParams, collection_id: id } })
        .then(res => toCamelcase<string>(res.data))
    }
    return requesterV1
      .get(`/${type}/download_csv`, { params: { ...rangeParams, id } })
      .then(res => toCamelcase<string>(res.data))
  },

  fetchNFTCollections: (page: string, sort: string, type?: string) =>
    requesterV2
      .get<{
        data: Array<NFTCollection>
        pagination: {
          count: number
          page: number
          next: number | null
          prev: number | null
          last: number
        }
      }>('nft/collections', {
        params: {
          page,
          sort,
          type,
        },
      })
      .then(res => res.data),

  fetchNFTCollection: (collection: string) =>
    requesterV2.get<NFTCollection>(`nft/collections/${collection}`).then(res => res.data),

  fetchNFTCollectionHolders: (id: string, page: string, sort?: string, addressHash?: string | null) =>
    requesterV2
      .get<{
        data: Record<string, number>
      }>(`/nft/collections/${id}/holders`, {
        params: {
          page,
          sort,
          address_hash: addressHash,
        },
      })
      .then(res => res.data),

  fetchNFTCollectionItems: (id: string, page: string) =>
    requesterV2
      .get<{
        data: Array<NFTItem>
        pagination: {
          count: number
          page: number
          next: number | null
          prev: number | null
          last: number
        }
      }>(`/nft/collections/${id}/items`, {
        params: {
          page,
        },
      })
      .then(res => res.data),

  fetchNFTCollectionItem: (collectionId: string, id: string) =>
    requesterV2.get<NFTItem>(`nft/collections/${collectionId}/items/${id}`).then(res => res.data),

  fetchNFTItemByOwner: (owner: string, standard: string, page?: string) =>
    requesterV2
      .get<{
        data: Array<NFTItem>
        pagination: {
          series: Array<string>
        }
      }>('nft/items', {
        params: {
          owner,
          standard,
          page,
        },
      })
      .then(res => res.data),

  fetchScriptInfo: (codeHash: string, hashType: string) =>
    requesterV2
      .get('scripts/general_info', {
        params: {
          code_hash: codeHash,
          hash_type: hashType,
        },
      })
      .then(res => toCamelcase<Response.Response<ScriptInfo>>(res.data)),

  fetchScriptCKBTransactions: (codeHash: string, hashType: string, page: number, pageSize: number) =>
    requesterV2
      .get('scripts/ckb_transactions', {
        params: {
          code_hash: codeHash,
          hash_type: hashType,
          page,
          page_size: pageSize,
        },
      })
      .then(res =>
        toCamelcase<
          Response.Response<{
            ckbTransactions: CKBTransactionInScript[]
            // TODO: This structure is unexpected and will be adjusted in the future.
            // Refs: https://github.com/Magickbase/ckb-explorer-public-issues/issues/451
            meta: {
              total: number
              pageSize: number
            }
          }>
        >(res.data),
      ),

  fetchScriptCells: (
    cellType: 'deployed_cells' | 'referring_cells',
    codeHash: string,
    hashType: string,
    page: number,
    pageSize: number,
  ) =>
    requesterV2
      .get(`scripts/${cellType}`, {
        params: {
          code_hash: codeHash,
          hash_type: hashType,
          page,
          page_size: pageSize,
        },
      })

      .then(res =>
        toCamelcase<
          Response.Response<{
            deployedCells?: CellInScript[]
            referringCells?: CellInScript[]
            // TODO: This structure is unexpected and will be adjusted in the future.
            // Refs: https://github.com/Magickbase/ckb-explorer-public-issues/issues/451
            meta: {
              total: number
              pageSize: number
            }
          }>
        >(res.data),
      ),

  fetchNFTCollectionTransferList: (
    id: string,
    page: string,
    tokenId?: string | null,
    transferAction?: string | null,
    addressHash?: string | null,
    txHash?: string | null,
  ) =>
    requesterV2
      .get<TransferListRes>(`/nft/transfers`, {
        params: {
          page,
          collection_id: id,
          token_id: tokenId,
          transfer_action: transferAction,
          address_hash: addressHash,
          tx_hash: txHash,
        },
      })
      .then(res => res.data),

  fetchDASAccounts: async (addresses: string[]): Promise<DASAccountMap> => {
    const { data } = await requesterV2.post<Record<string, string>>('das_accounts', {
      addresses,
    })
    const dataWithNormalizeEmptyValue = Object.fromEntries(
      Object.entries(data).map(([addr, account]) => {
        return account === '' ? [addr, null] : [addr, account]
      }),
    )
    return dataWithNormalizeEmptyValue
  },
}

// ====================
// Types
// ====================

export namespace FeeRateTracker {
  export interface TransactionFeeRate {
    id: number
    timestamp: number
    feeRate: number
    confirmationTime: number
  }

  export interface PendingTransactionFeeRate {
    id: number
    feeRate: number
  }

  export interface LastNDaysTransactionFeeRate {
    date: string
    feeRate: string
  }

  export interface TransactionFeesStatistic {
    transactionFeeRates: TransactionFeeRate[]
    pendingTransactionFeeRates: PendingTransactionFeeRate[]
    lastNDaysTransactionFeeRates: LastNDaysTransactionFeeRate[]
  }

  export interface FeeRateCard {
    priority: string
    icon: ReactNode
    feeRate?: string
    priorityClass: string
    confirmationTime: number
  }
}

export interface NFTCollection {
  id: number
  standard: string
  name: string
  description: string
  h24_ckb_transactions_count: string
  creator: string | null
  icon_url: string | null
  items_count: number | null
  holders_count: number | null
  type_script: { code_hash: string; hash_type: 'data' | 'type'; args: string } | null
}

export interface NFTItem {
  icon_url: string | null
  id: number
  token_id: string
  owner: string | null
  standard: string | null
  cell: {
    cell_index: number
    data: string | null
    status: string
    tx_hash: string
  } | null
  collection: NFTCollection
  name: string | null
  metadata_url: string | null
}

export interface ScriptInfo {
  id: string
  scriptName: string
  scriptType: string
  codeHash: string
  hashType: 'type' | 'data'
  capacityOfDeployedCells: string
  capacityOfReferringCells: string
  countOfTransactions: number
  countOfDeployedCells: number
  countOfReferringCells: number
}

export interface CKBTransactionInScript {
  id: number
  txHash: string
  blockId: number
  blockNumber: number
  blockTimestamp: number
  transactionFee: number
  isCellbase: boolean
  txStatus: string
  displayInputs: State.Cell[]
  displayOutputs: State.Cell[]
}

export interface CellInScript {
  id: number
  capacity: string
  data: string
  ckbTransactionId: number
  createdAt: string
  updatedAt: string
  status: string
  addressId: number
  blockId: number
  txHash: string
  cellIndex: number
  generatedById?: number
  consumedById?: number
  cellType: string
  dataSize: number
  occupiedCapacity: number
  blockTimestamp: number
  consumedBlockTimestamp: number
  typeHash?: string
  udtAmount: number
  dao: string
  lockScriptId?: number
  typeScriptId?: number
}

export interface TransferRes {
  id: number
  from: string | null
  to: string | null
  action: 'mint' | 'normal' | 'destruction'
  item: NFTItem
  transaction: {
    tx_hash: string
    block_number: number
    block_timestamp: number
  }
}

export interface TransferListRes {
  data: Array<TransferRes>
  pagination: {
    count: number
    page: number
    next: number | null
    prev: number | null
    last: number
  }
}

export type DASAccount = string

export type DASAccountMap = Record<string, DASAccount | null>
