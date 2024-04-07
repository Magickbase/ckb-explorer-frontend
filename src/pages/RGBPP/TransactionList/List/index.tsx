import { TFunction, useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import { TransactionLeapDirection } from '../../../../components/RGBPP/types'
import AddressText from '../../../../components/AddressText'
import { Link } from '../../../../components/Link'
import { localeNumberString } from '../../../../utils/number'
import SortButton from '../../../../components/SortButton'
import FilterButton from '../../../../components/FilterButton'
import { useIsXXLBreakPoint } from '../../../../hooks'

const RGBTransactionList: React.FC<{ list: Transaction[] }> = ({ list }) => {
  const [t] = useTranslation()

  const filterFields = getFilterList(t)

  const headers = getTableHeaders()

  const isMobile = useIsXXLBreakPoint()

  return (
    <div className={styles.container}>
      {isMobile && (
        <div className={styles.filters}>
          <div className={styles.left}>
            {headers.map((header, key) => {
              return (
                (header.filter || header.order) &&
                key % 2 === 0 && (
                  <div>
                    {header.title}
                    {header.filter && <FilterButton key={header.key} filteredList={filterFields} isMobile />}
                    {header.order && <SortButton key={header.key} field={header.key} />}
                  </div>
                )
              )
            })}
          </div>
          <div className={styles.right}>
            {headers.map((header, key) => {
              return (
                (header.filter || header.order) &&
                key % 2 === 1 && (
                  <div>
                    {header.title}
                    {header.filter && <FilterButton key={header.key} filteredList={filterFields} isMobile />}
                    {header.order && <SortButton key={header.key} field={header.key} />}
                  </div>
                )
              )
            })}
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header.key}>
                {header.title}
                {header.order ? <SortButton field={header.key} /> : null}
                {header.filter ? <FilterButton filteredList={filterFields} /> : null}
              </th>
            ))}
          </tr>
          <tr key="split" style={{ marginLeft: '-10px' }}>
            <td className={styles.split} colSpan={headers.length}>
              {' '}
            </td>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map(item => {
              let leapDirection = '/'
              if (item.type === TransactionLeapDirection.IN) {
                leapDirection = 'Leap In'
              }

              if (item.type === TransactionLeapDirection.OUT) {
                leapDirection = 'Leap Out'
              }

              return (
                <tr key={item.ckbTxId}>
                  <td className={styles.hash} title={t('transaction.transaction_hash')}>
                    <div className={styles.transactionHash}>
                      <AddressText
                        disableTooltip
                        linkProps={{
                          to: `/transaction/${item.ckbTxId}`,
                        }}
                      >
                        {item.ckbTxId}
                      </AddressText>
                    </div>
                  </td>
                  <td className={styles.height} title={t('transaction.height')}>
                    <Link className={styles.blockLink} to={`/block/${item.blockNumber}`}>
                      {localeNumberString(item.blockNumber)}
                    </Link>
                  </td>
                  <td className={styles.confirmation} title={t('transaction.confirmation')}>
                    {item.confirmation} Confirmation
                  </td>
                  <td className={styles.time} title={t('transaction.time')}>
                    {item.time}s ago
                  </td>
                  <td className={styles.type} title={t('transaction.type')}>
                    {leapDirection}
                  </td>
                  <td className={styles.cellChange} title={t('transaction.cell_change')}>
                    {item.cellChange} Cells
                  </td>
                  <td className={styles.hash} title={t('transaction.btc_txid')}>
                    <AddressText
                      style={{ marginLeft: 'auto' }}
                      disableTooltip
                      linkProps={{
                        to: `/transaction/${item.ckbTxId}`,
                      }}
                    >
                      {item.btcTxId}
                    </AddressText>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={headers.length} className={styles.noRecords}>
                {t('transaction.no_records')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RGBTransactionList

export type Transaction = {
  ckbTxId: string
  blockNumber: number
  confirmation: number
  time: number
  type: TransactionLeapDirection
  cellChange: number
  btcTxId: string
}

const getFilterList = (t: TFunction): Record<'title' | 'value' | 'to', string>[] => {
  return [
    {
      value: 'leap_in',
      title: t('address.leap_in'),
      to: '',
    },
    {
      value: 'leap_out',
      title: t('address.leap_out'),
      to: '',
    },
    {
      value: '-',
      title: '-',
      to: '',
    },
  ]
}

const getTableHeaders = (): TableHeader[] => {
  return [
    { title: 'CKB TXID', key: 'ckb-txid' },
    { title: 'Block Number', key: 'block-number', order: 'asc' },
    { title: 'Confirmation', key: 'confirmation', order: 'asc' },
    { title: 'Time', key: 'time', order: 'asc' },
    { title: 'Type', key: 'type', filter: 'in' },
    { title: 'Cell Change', key: 'cell-change' },
    { title: 'BTC TXID', key: 'btc-txid' },
  ]
}

interface TableHeader {
  title: string
  key: string
  order?: 'asc' | 'desc'
  filter?: 'in' | 'out'
}
