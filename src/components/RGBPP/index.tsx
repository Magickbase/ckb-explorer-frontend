import { useState } from 'react'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { Transaction } from '../../models/Transaction'
import SimpleModal from '../Modal'
import SimpleButton from '../SimpleButton'
import TransactionRGBPPDigestModal from '../TransactionItem/TransactionRGBPPDigestModal'
import styles from './styles.module.scss'
import { TransactionLeapDirection } from './types'
import { Cell } from '../../models/Cell'
import { matchScript } from '../../utils/util'

const computeRGBPPCellAmount = (cells: Cell[]) =>
  cells.filter(cell => {
    try {
      const script = addressToScript(cell.addressHash)
      const tag = matchScript(script.codeHash, script.hashType)
      return tag?.tag === 'rgb++'
    } catch (e) {
      return false
    }
  }).length

const RGBPP = ({ transaction }: { transaction: Transaction }) => {
  const [showModal, setShowModal] = useState(false)

  const inputRGBAmount = computeRGBPPCellAmount(transaction.displayInputs)
  const outputRGBAmount = computeRGBPPCellAmount(transaction.displayOutputs)

  return (
    <div>
      <SimpleButton
        onClick={() => {
          setShowModal(true)
        }}
      >
        <div className={styles.rgbpp}>
          <span>RGB++</span>
        </div>
      </SimpleButton>
      <SimpleModal isShow={showModal} setIsShow={setShowModal}>
        <TransactionRGBPPDigestModal
          onClickClose={() => setShowModal(false)}
          hash={transaction.transactionHash}
          leapDirection={inputRGBAmount > outputRGBAmount ? TransactionLeapDirection.OUT : TransactionLeapDirection.IN}
        />
      </SimpleModal>
    </div>
  )
}

export default RGBPP
