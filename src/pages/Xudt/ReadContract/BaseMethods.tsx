import { FC } from 'react'
import styles from './BaseMethods.module.scss'
import { XUDT } from '../../../models/Xudt'
import { SSRIBaseMethods } from './types'

const BaseMethods: FC<{ xudt: XUDT | undefined }> = ({ xudt }) => {
  if (!xudt) {
    return null
  }
  return (
    <div className={styles.container}>
      {SSRIBaseMethods.map((item, index) => {
        const value = item.getValue(xudt)
        const valueType = item.type
        return (
          <div key={item.method} className={styles.item}>
            <div className={styles.label}>
              {index + 1}. {item.method}
              <span className={styles.hash}>({item.hash})</span>
            </div>
            <div className={styles.value}>
              {valueType === 'string' && <div>{value}</div>}
              {valueType === 'image' && <img src={value ?? ''} alt="icon" width={100} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BaseMethods
