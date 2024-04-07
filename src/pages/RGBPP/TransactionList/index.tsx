import { useQuery } from '@tanstack/react-query'
import Content from '../../../components/Content'
import { useSearchParams } from '../../../hooks'
import List, { type Transaction } from './List'
import { TransactionLeapDirection } from '../../../components/RGBPP/types'
import { QueryResult } from '../../../components/QueryResult'

const RGBPPTransactionList = () => {
  const { sort } = useSearchParams('sort')
  const { type } = useSearchParams('type')

  const transactions = useQuery(['rgbpp_transactions', sort, type], async () => {
    return mockTransactionList(20)
  })
  return (
    <Content>
      <div className="container">
        <QueryResult query={transactions} delayLoading>
          {data => <List list={data ?? []} />}
        </QueryResult>
      </div>
    </Content>
  )
}

const mockTransactionList = (amount: number): Transaction[] => {
  return Array.from({ length: amount }).map(() => ({
    ckbTxId: '0x09eec9ee3f27ba809565e07b8b389376cb9a73df04d4fd5225637fc82a1cfabc',
    blockNumber: Date.now(),
    confirmation: 0,
    time: 7,
    type: TransactionLeapDirection.IN,
    cellChange: 10,
    btcTxId: '09eec9ee3f27ba809565e07b8b389376cb9a73df04d4fd5225637fc82a1cfabc',
  }))
}

export default RGBPPTransactionList
