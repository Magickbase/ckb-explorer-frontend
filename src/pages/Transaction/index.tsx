import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ResultFormatter } from '@ckb-lumos/rpc'
import Content from '../../components/Content'
import { TransactionDiv as TransactionPanel } from './TransactionComp/styled'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import { defaultTransactionInfo } from './state'
import { useSearchParams } from '../../hooks'
import { useCKBNode } from '../../hooks/useCKBNode'
import { LayoutLiteProfessional } from '../../constants/common'
import { TransactionCompLite } from './TransactionComp/TransactionLite/TransactionLite'
import { TransactionComp } from './TransactionComp/TransactionComp'
import { NodeTransactionComp } from './TransactionComp/NodeTransactionComp'
import { TransactionOverviewCard } from './TransactionComp/TransactionOverview'
import { NodeTransactionOverviewCard } from './TransactionComp/NodeTransactionOverview'
import { TransactionDetailsHeader } from './TransactionComp/TransactionDetailsHeader'
import { RGBDigestComp } from './TransactionComp/RGBDigestComp'

export default () => {
  const { Professional, Lite } = LayoutLiteProfessional
  const { hash: txHash } = useParams<{ hash: string }>()
  const { nodeService, activate: nodeActivate } = useCKBNode()

  const query = useQuery(
    ['transaction', txHash],
    async () => {
      const transaction = await explorerService.api.fetchTransactionByHash(txHash)
      if (transaction.displayOutputs && transaction.displayOutputs.length > 0) {
        transaction.displayOutputs[0].isGenesisOutput = transaction.blockNumber === 0
      }
      return transaction
    },
    {
      enabled: !nodeActivate,
    },
  )

  const nodeTxQuery = useQuery(['node', 'transaction', txHash], () => nodeService.getTx(txHash), {
    enabled: nodeActivate,
  })

  const transaction = query.data ?? defaultTransactionInfo
  const searchParams = useSearchParams('layout')
  const layout = searchParams.layout === Lite ? Lite : Professional

  return (
    <Content>
      <TransactionPanel>
        {nodeActivate ? (
          <QueryResult query={nodeTxQuery} delayLoading>
            {nodeTx =>
              nodeTx ? (
                <NodeTransactionOverviewCard transactionWithStatus={nodeTx.result} />
              ) : (
                <div>{`Transaction ${txHash} not loaded`}</div>
              )
            }
          </QueryResult>
        ) : (
          <TransactionOverviewCard
            txHash={txHash}
            transaction={transaction}
            layout={layout}
            isRGB={transaction.isRgbTransaction}
          />
        )}

        {transaction.isRgbTransaction && <RGBDigestComp hash={txHash} txid={transaction.rgbTxid ?? undefined} />}

        <TransactionDetailsHeader showLayoutSwitcher={!nodeActivate} layout={layout} />

        {nodeActivate ? (
          <QueryResult query={nodeTxQuery}>
            {nodeTx =>
              nodeTx && nodeTx.result.transaction ? (
                <NodeTransactionComp transaction={ResultFormatter.toTransaction(nodeTx.result.transaction)} />
              ) : (
                <div>{`Transaction ${txHash} not loaded`}</div>
              )
            }
          </QueryResult>
        ) : (
          <>
            {layout === Professional ? (
              <QueryResult query={query} delayLoading>
                {transaction => (transaction ? <TransactionComp transaction={transaction} /> : <div />)}
              </QueryResult>
            ) : (
              <QueryResult query={query} delayLoading>
                {transaction => <TransactionCompLite isCellbase={transaction?.isCellbase ?? false} />}
              </QueryResult>
            )}
          </>
        )}
      </TransactionPanel>
    </Content>
  )
}
