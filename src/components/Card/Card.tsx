import { ComponentProps, FC } from 'react'
import classNames from 'classnames'
import styles from './Card.module.scss'

// TODO: childrenGap / splitType
export const Card: FC<ComponentProps<'div'>> = ({ children, ...elProps }) => {
  return (
    <div {...elProps} className={classNames(styles.card, elProps.className)}>
      {children}
    </div>
  )
}
