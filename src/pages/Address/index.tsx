import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import { FC } from 'react'
import { Address as AddressInfo } from '../../models/Address'
import Content from '../../components/Content'
import { AddressContentPanel } from './styled'
import { AddressTransactions, AddressOverviewCard } from './AddressComp'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import type { Transaction } from '../../models/Transaction'
import {
  useDeprecatedAddr,
  useNewAddr,
  usePaginationParamsInListPage,
  useSearchParams,
  useSortParam,
} from '../../hooks'
import { isAxiosError } from '../../utils/error'
import { Card, HashCardHeader } from '../../components/Card'
import { ReactComponent as ShareIcon } from './share.svg'
import styles from './styles.module.scss'
import { useDASAccount } from '../../hooks/useDASAccount'
import { Link } from '../../components/Link'
import { isValidBTCAddress } from '../../utils/bitcoin'
import config from '../../config'
import { defaultAddressInfo } from './state'
import { BTCAddressOverviewCard } from './BTCAddressComp'

export const Address = () => {
  const { address } = useParams<{ address: string }>()
  const { t } = useTranslation()
  const { currentPage, pageSize } = usePaginationParamsInListPage()
  const { tx_status: txStatus } = useSearchParams('tx_status')

  // REFACTOR: avoid using useSortParam
  const { sortBy, orderBy, sort } = useSortParam<'time'>(s => s === 'time')

  const isPendingTxListActive = txStatus === 'pending'

  const addressInfoQuery = useQuery(['address_info', address], () => explorerService.api.fetchAddressInfo(address))

  const isRGBPP = isValidBTCAddress(address)

  let addressInfo: AddressInfo | undefined
  if (isRGBPP) {
    addressInfo = addressInfoQuery.data?.[0]
  } else {
    addressInfo = addressInfoQuery.data?.reduce((acc, cur) => {
      return {
        ...cur,
        ...{
          daoCompensation: acc.daoCompensation + cur.daoCompensation,
          daoDeposit: acc.daoDeposit + cur.daoDeposit,
          interest: acc.interest + cur.interest,
          liveCellsCount: acc.liveCellsCount + cur.liveCellsCount,
          minedBlocksCount: acc.minedBlocksCount + cur.minedBlocksCount,
          pendingRewardBlocksCount: acc.pendingRewardBlocksCount + cur.pendingRewardBlocksCount,
          transactionsCount: acc.transactionsCount + cur.transactionsCount,
          udtAccounts: acc.udtAccounts ? acc.udtAccounts.concat(cur.udtAccounts ?? []) : cur.udtAccounts,
        },
      }
    }, defaultAddressInfo)
  }

  const listQueryKey = [
    isPendingTxListActive ? 'address_pending_transactions' : 'address_transactions',
    address,
    currentPage,
    pageSize,
    sort,
  ]
  const listQueryIns = isPendingTxListActive
    ? explorerService.api.fetchPendingTransactionsByAddress
    : explorerService.api.fetchTransactionsByAddress

  const addressTransactionsQuery = useQuery(listQueryKey, async () => {
    try {
      const { data: transactions, total } = await listQueryIns(address, currentPage, pageSize, sort)
      return {
        transactions,
        total,
      }
    } catch (err) {
      const isEmptyAddress = isAxiosError(err) && err.response?.status === 404
      if (isEmptyAddress) {
        return {
          transactions: [],
          total: 0,
        }
      }
      throw err
    }
  })

  /* reuse the cache of address_pending_transactions query by using the same query key */
  const pendingTransactionCountQuery = useQuery<{ transactions: Transaction[]; total: number | '-' }>(
    ['address_pending_transactions', address, currentPage, pageSize, sort],
    async () => {
      try {
        const { data: transactions, total } = await explorerService.api.fetchPendingTransactionsByAddress(
          address,
          currentPage,
          pageSize,
          sort,
        )
        return {
          transactions,
          total,
        }
      } catch (err) {
        return { transactions: [], total: '-' }
      }
    },
    {
      initialData: { transactions: [], total: '-' },
    },
  )

  const transactionCounts: Record<'committed' | 'pending', number | '-'> = {
    committed:
      addressInfoQuery.isFetched && addressInfoQuery.data
        ? // FIXME: this type conversion could be removed once the type declaration of Transaction is fixed
          Number(addressInfo?.transactionsCount) ?? '-'
        : '-',
    pending: pendingTransactionCountQuery.data?.total ?? '-',
  }

  const newAddr = useNewAddr(address)
  const deprecatedAddr = useDeprecatedAddr(address)
  const counterpartAddr = newAddr === address ? deprecatedAddr : newAddr

  return (
    <Content>
      <AddressContentPanel className="container">
        <Card>
          <HashCardHeader
            title={addressInfo?.type === 'LockHash' ? t('address.lock_hash') : t('address.address')}
            hash={address}
            customActions={[
              isRGBPP || counterpartAddr ? (
                <Tooltip
                  placement="top"
                  title={t(`address.${newAddr === address ? 'visit-deprecated-address' : 'view-new-address'}`)}
                >
                  {isRGBPP ? (
                    <a href={`${config.BITCOIN_EXPLORER}address/${address}`}>
                      <ShareIcon />
                    </a>
                  ) : (
                    <Link
                      className={styles.openInNew}
                      to={`/address/${counterpartAddr}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ShareIcon />
                    </Link>
                  )}
                </Tooltip>
              ) : null,
            ]}
            rightContent={addressInfo?.addressHash && <DASInfo address={addressInfo?.addressHash} />}
          />
        </Card>

        <AddressOverView isRGBPP={isRGBPP} addressInfo={addressInfo} />

        <QueryResult query={addressTransactionsQuery} delayLoading>
          {data => (
            <AddressTransactions
              address={address}
              transactions={data?.transactions ?? []}
              timeOrderBy={sortBy === 'time' ? orderBy : 'desc'}
              meta={{
                counts: transactionCounts,
              }}
            />
          )}
        </QueryResult>
      </AddressContentPanel>
    </Content>
  )
}

const AddressOverView = ({ isRGBPP, addressInfo }: { isRGBPP: boolean; addressInfo?: AddressInfo }) => {
  if (addressInfo) {
    if (isRGBPP) {
      return <BTCAddressOverviewCard address={addressInfo} />
    }

    return <AddressOverviewCard address={addressInfo} />
  }

  return <div />
}

const DASInfo: FC<{ address: string }> = ({ address }) => {
  const alias = useDASAccount(address)

  if (alias == null) return null

  return (
    <Tooltip placement="top" title={alias}>
      <a className={styles.dasAccount} href={`https://data.did.id/${alias}`} target="_blank" rel="noreferrer">
        <img src={`https://display.did.id/identicon/${alias}`} alt={alias} />
        <span>{alias}</span>
      </a>
    </Tooltip>
  )
}

export default Address
