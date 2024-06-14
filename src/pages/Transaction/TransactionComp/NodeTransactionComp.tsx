import { Transaction } from '@ckb-lumos/base'
import { useQuery } from '@tanstack/react-query'
import NodeTransactionCellList from '../TransactionCellList/NodeTransactionCellList'
import { useCKBNode } from '../../../hooks/useCKBNode'
import { getTransactionOutputCells } from '../../../utils/transaction'
import Loading from '../../../components/Loading'

export const NodeTransactionComp = ({ transaction }: { transaction: Transaction }) => {
  const { nodeService } = useCKBNode()
  const { data: inputCells, isFetching: isInputsLoading } = useQuery(['node', 'inputCells', transaction?.hash], () =>
    nodeService.getInputCells(transaction.inputs),
  )

  const outputCells = getTransactionOutputCells(transaction)

  return (
    <>
      <div className="transactionInputs">
        <Loading show={isInputsLoading} />
        <NodeTransactionCellList total={inputCells?.length ?? 0} inputs={inputCells} startIndex={0} />
      </div>
      <div className="transactionOutputs">
        <NodeTransactionCellList total={outputCells.length} outputs={outputCells} startIndex={0} />
      </div>
    </>
  )
}
