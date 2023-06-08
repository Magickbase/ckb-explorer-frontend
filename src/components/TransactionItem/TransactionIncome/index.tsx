import BigNumber from 'bignumber.js'
import { Tooltip } from 'antd'
import i18n from '../../../utils/i18n'
import { TransactionIncomePanel, TransactionCapacityValuePanel } from './styled'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import DecimalCapacity from '../../DecimalCapacity'
import CurrentAddressIcon from '../../../assets/current_address.png'

export default ({ income }: { income: string }) => {
  let bigIncome = new BigNumber(income)
  if (bigIncome.isNaN()) {
    bigIncome = new BigNumber(0)
  }
  return (
    <TransactionIncomePanel>
      <TransactionCapacityValuePanel increased={bigIncome.isGreaterThanOrEqualTo(0)}>
        <DecimalCapacity
          value={`${bigIncome.isPositive() ? '+' : ''}${localeNumberString(shannonToCkb(bigIncome))}`}
          color="inherit"
        />
        <Tooltip placement="top" title={`${i18n.t('address.currentAddress')} `}>
          <img src={CurrentAddressIcon} alt="current Address" />
        </Tooltip>
      </TransactionCapacityValuePanel>
    </TransactionIncomePanel>
  )
}
