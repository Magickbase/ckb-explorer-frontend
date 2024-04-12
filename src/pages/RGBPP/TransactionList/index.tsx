import { useQuery } from '@tanstack/react-query'
import Content from '../../../components/Content'
import styles from './styles.module.scss'
import { usePaginationParamsInPage, useSearchParams } from '../../../hooks'
import List, { Transaction } from './List'
import { QueryResult } from '../../../components/QueryResult'
import Pagination from '../../../components/Pagination'
import { explorerService } from '../../../services/ExplorerService'
import { TransactionLeapDirection } from '../../../components/RGBPP/types'
import Chart from './Chart'

const PAGE_SIZE = 20

const RGBPPTransactionList = () => {
  const { sort } = useSearchParams('sort')
  const { type } = useSearchParams('type')

  const { currentPage, setPage } = usePaginationParamsInPage()

  const transactions = useQuery(['rgbpp_transactions', currentPage, sort, type], async () => {
    const {
      data,
      meta: { total, pageSize },
    } = await explorerService.api.fetchRGBTransactions(currentPage, PAGE_SIZE, sort, type)

    return {
      transactions: data.ckbTransactions.map<Transaction>(tx => {
        let leapDirection = TransactionLeapDirection.NONE

        if (tx.leapDirection === 'in') {
          leapDirection = TransactionLeapDirection.IN
        }

        if (tx.leapDirection === 'out') {
          leapDirection = TransactionLeapDirection.OUT
        }

        return {
          ckbTxId: tx.txHash,
          blockNumber: tx.blockNumber,
          time: Math.ceil((Date.now() - tx.blockTimestamp) / 1000),
          type: leapDirection,
          cellChange: tx.rgbCellChanges,
          btcTxId: tx.rgbTxid,
        }
      }),
      totalPage: Math.ceil(total / pageSize),
    }
  })
  return (
    <Content>
      <div className={styles.title}>RGB++ Transaction List</div>
      <Chart />
      <QueryResult query={transactions} delayLoading>
        {data => (
          <>
            <List list={data?.transactions ?? []} />
            <div className={styles.pagination}>
              <Pagination currentPage={currentPage} totalPages={data?.totalPage ?? 1} onChange={setPage} />
            </div>
          </>
        )}
      </QueryResult>
    </Content>
  )
}

export default RGBPPTransactionList
