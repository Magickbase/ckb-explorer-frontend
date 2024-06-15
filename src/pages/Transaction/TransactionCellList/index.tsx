import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { IOType } from '../../../constants/common'
import TransactionCell from '../TransactionCell'
import { ReactComponent as DeprecatedAddrOn } from './deprecated_addr_on.svg'
import { ReactComponent as DeprecatedAddrOff } from './deprecated_addr_off.svg'
import { ReactComponent as Warning } from './warning.svg'
import styles from './styles.module.scss'
import { Cell } from '../../../models/Cell'
import { useIsDeprecatedAddressesDisplayed } from './useIsDeprecatedAddressesDisplayed'
import { TransactionCellList } from './TransactionCellList'

export default ({
  total,
  inputs,
  outputs,
  txHash,
  showReward,
  startIndex,
}: {
  total?: number
  inputs?: Cell[]
  outputs?: Cell[]
  txHash?: string
  showReward?: boolean
  startIndex: number
}) => {
  const { t } = useTranslation()
  const cells = inputs || outputs || []
  const isCellbaseInput = inputs && inputs.length > 0 && inputs[0].fromCellbase

  const [isDeprecatedAddressesDisplayed, addrFormatToggleURL] = useIsDeprecatedAddressesDisplayed()

  const cellTitle = (() => {
    const title = inputs ? t('transaction.input') : t('transaction.output')
    return (
      <div className={styles.cellListTitle}>
        {`${title} (${total ?? '-'})`}
        <Tooltip placement="top" title={t(`address.view-deprecated-address`)}>
          <Link className={styles.newAddrToggle} to={addrFormatToggleURL} role="presentation">
            {!isDeprecatedAddressesDisplayed ? <DeprecatedAddrOff /> : <DeprecatedAddrOn />}
          </Link>
        </Tooltip>
        {!isDeprecatedAddressesDisplayed ? null : (
          <Tooltip placement="top" title={t('address.displaying-deprecated-address')}>
            <Warning />
          </Tooltip>
        )}
      </div>
    )
  })()

  return (
    <TransactionCellList
      title={cellTitle}
      extra={
        <>
          <div>{isCellbaseInput ? t('transaction.reward_info') : t('transaction.detail')}</div>
          <div>{isCellbaseInput ? '' : t('transaction.capacity_amount')}</div>
        </>
      }
    >
      {!cells.length ? (
        <div className={styles.dataBeingProcessed}>{t('transaction.data-being-processed')}</div>
      ) : (
        cells?.map((cell, index) => (
          <TransactionCell
            key={cell.id}
            cell={cell}
            ioType={inputs ? IOType.Input : IOType.Output}
            index={index + startIndex}
            txHash={txHash}
            showReward={showReward}
            isAddrNew={!isDeprecatedAddressesDisplayed}
          />
        ))
      )}
    </TransactionCellList>
  )
}
