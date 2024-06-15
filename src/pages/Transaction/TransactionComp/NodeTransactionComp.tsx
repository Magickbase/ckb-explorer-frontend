import { Transaction } from '@ckb-lumos/base'
import { useQuery } from '@tanstack/react-query'
import NodeTransactionCellList from '../TransactionCellList/NodeTransactionCellList'
import NodeTransactionCellBase from '../TransactionCellList/NodeTransactionCellBase'
import { useCKBNode } from '../../../hooks/useCKBNode'
import { checkIsCellBase, getTransactionOutputCells } from '../../../utils/transaction'
import Loading from '../../../components/Loading'
import { IOType } from '../../../constants/common'

export const NodeTransactionComp = ({
  transaction,
  blockHash,
  blockNumber,
}: {
  transaction: Transaction
  blockHash?: string
  blockNumber?: string
}) => {
  const isCellBase = checkIsCellBase(transaction)
  const { nodeService } = useCKBNode()
  const { data: inputCells, isFetching: isInputsLoading } = useQuery(['node', 'inputCells', transaction?.hash], () =>
    nodeService.getInputCells(transaction.inputs),
  )
  const outputCells = getTransactionOutputCells(transaction)

  return (
    <>
      <div className="transactionInputs">
        {isCellBase ? (
          <NodeTransactionCellBase blockHash={blockHash} blockNumber={blockNumber} />
        ) : (
          <>
            <Loading show={isInputsLoading} />
            <NodeTransactionCellList cells={inputCells} ioType={IOType.Input} />
          </>
        )}
      </div>
      <div className="transactionOutputs">
        <NodeTransactionCellList cells={outputCells} ioType={IOType.Output} />
      </div>
    </>
  )
}
