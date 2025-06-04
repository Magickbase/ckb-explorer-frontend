import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { ssri } from '@ckb-ccc/ssri'
import MethodCaller from './MethodCaller'
import styles from './index.module.scss'
import { ReadContractContext, ReadContractContextProvider } from './context'
import CONFIG from '../../../config'
import { XUDT } from '../../../models/Xudt'
import BaseMethods from './BaseMethods'
import { SSRIBaseMethods } from './types'

const SSRIExecutorURL = CONFIG.REACT_APP_SSRI_RPC_URL!
const SSRIExecutor = new ssri.ExecutorJsonRpc(SSRIExecutorURL)

const ReadContract: FC<{ xudt: XUDT | undefined }> = ({ xudt }) => {
  const { signer } = useContext(ReadContractContext)
  const [methodList, setMethodList] = useState<string[]>([])

  const getMethodList = useCallback(async () => {
    if (!xudt?.ssriContractOutpoint) {
      return
    }
    const targetOutPoint = {
      txHash: xudt.ssriContractOutpoint.txHash,
      index: xudt.ssriContractOutpoint.cellIndex,
    }
    const scriptCell = await signer.client.getCell(targetOutPoint)

    if (!scriptCell) {
      throw new Error('Script cell not found')
    }

    if (!scriptCell.cellOutput.type?.hash()) {
      throw new Error('Script cell type hash not found')
    }
    const contract = new ssri.Trait(scriptCell.outPoint, SSRIExecutor)

    if (!contract) {
      throw new Error('Contract not initialized')
    }

    const methodList = await contract.getMethods()
    setMethodList(methodList.res)
  }, [signer.client, xudt?.ssriContractOutpoint])

  useEffect(() => {
    getMethodList()
  }, [getMethodList])

  if (!xudt?.ssriContractOutpoint?.txHash || xudt?.ssriContractOutpoint?.cellIndex === undefined) {
    return null
  }

  const customMethodList = methodList.filter(method => SSRIBaseMethods.every(item => item.hash !== method))

  return (
    <div className={styles.container}>
      <BaseMethods xudt={xudt} />
      {customMethodList.map((method, index) => (
        <ReadContractContextProvider
          key={method}
          contractOutPointTx={xudt.ssriContractOutpoint!.txHash}
          contractOutPointIndex={xudt.ssriContractOutpoint!.cellIndex}
          method={method}
          SSRIExecutor={SSRIExecutor}
        >
          <MethodCaller methodName={method} index={index + SSRIBaseMethods.length + 1} />
        </ReadContractContextProvider>
      ))}
    </div>
  )
}

export default ReadContract
