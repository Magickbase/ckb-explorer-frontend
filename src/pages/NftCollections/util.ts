import { includes } from '../../utils/array'
import { useSortParam } from '../../utils/hook'

const NFTSortByTypes = ['transactions', 'holder', 'minted'] as const
type NFTSortByType = (typeof NFTSortByTypes)[number]

export const useNFTCollectionsSortParam = () =>
  useSortParam<NFTSortByType>(s => includes(NFTSortByTypes, s), 'transactions.desc')
