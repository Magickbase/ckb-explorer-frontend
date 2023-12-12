import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import { FC } from 'react'
import Content from '../../components/Content'
import { AddressContentPanel } from './styled'
import { AddressTransactions, AddressOverviewCard } from './AddressComp'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
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

export const Address = () => {
  const { address } = useParams<{ address: string }>()
  const { t } = useTranslation()
  const { currentPage, pageSize } = usePaginationParamsInListPage()
  const { tx_status: txStatus } = useSearchParams('tx_status')

  // REFACTOR: avoid using useSortParam
  const { sortBy, orderBy, sort } = useSortParam<'time'>(s => s === 'time')

  const isPendingTxListActive = txStatus === 'pending'

  const addressInfoQuery = useQuery(['address_info', address], () => explorerService.api.fetchAddressInfo(address))

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

  const pendingTransactionCountQuery = useQuery(
    ['address_pending_transactions', address],
    async () => {
      try {
        const { total } = await explorerService.api.fetchPendingTransactionsByAddress(address, 1, 10)
        return total
      } catch (err) {
        return '-'
      }
    },
    {
      initialData: '-',
    },
  )

  const transactionCounts: Record<'committed' | 'pending', number | '-'> = {
    committed:
      addressInfoQuery.isFetched && addressInfoQuery.data
        ? Number(addressInfoQuery.data.transactionsCount) ?? '-'
        : '-',
    pending: pendingTransactionCountQuery.isFetched ? pendingTransactionCountQuery.data ?? '-' : '-',
  }

  const newAddr = useNewAddr(address)
  const deprecatedAddr = useDeprecatedAddr(address)
  const counterpartAddr = newAddr === address ? deprecatedAddr : newAddr

  return (
    <Content>
      <AddressContentPanel className="container">
        <Card>
          <HashCardHeader
            title={addressInfoQuery.data?.type === 'LockHash' ? t('address.lock_hash') : t('address.address')}
            hash={address}
            customActions={[
              counterpartAddr ? (
                <Tooltip
                  placement="top"
                  title={t(`address.${newAddr === address ? 'visit-deprecated-address' : 'view-new-address'}`)}
                >
                  <a
                    href={`${window.location.href.split('/address/')[0]}/address/${counterpartAddr}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.openInNew}
                  >
                    <ShareIcon />
                  </a>
                </Tooltip>
              ) : null,
            ]}
            rightContent={
              addressInfoQuery.data?.addressHash && <DASInfo address={addressInfoQuery.data?.addressHash} />
            }
          />
        </Card>

        <QueryResult query={addressInfoQuery} delayLoading>
          {data => (data ? <AddressOverviewCard address={data} /> : <div />)}
        </QueryResult>

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
