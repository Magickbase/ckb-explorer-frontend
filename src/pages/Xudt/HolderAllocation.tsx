import { useTranslation } from 'react-i18next'
import styles from './HolderAllocation.module.scss'

const HolderAllocation = ({ typeHash }: { typeHash: string }) => {
  const [t] = useTranslation()
  return (
    <div className={styles.holderAllocationContainer}>
      <h2>{t('xudt.holder_allocation')}</h2>
      <p>
        {t('xudt.holder_allocation_description', {
          ckb: '1,000',
          btc: '200',
        })}
        {typeHash}
      </p>
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <td>
                <div>{t('xudt.lock_hash')}</div>
              </td>
              <td>
                <div>{t('xudt.count')}</div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>secp256k1</div>
              </td>
              <td>
                <div>200</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>omnilock</div>
              </td>
              <td>
                <div>400</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>joyid</div>
              </td>
              <td>
                <div>100</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>RGB++</div>
              </td>
              <td>
                <div>400</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>other</div>
              </td>
              <td>
                <div>300</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HolderAllocation
