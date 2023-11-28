import { ComponentProps, FC } from 'react'
import classNames from 'classnames'
import styles from './Card.module.scss'

export interface CardProps extends ComponentProps<'div'> {
  rounded?: boolean
}

export const Card: FC<CardProps> = ({ children, rounded = true, ...elProps }) => {
  return (
    <div
      {...elProps}
      className={classNames(
        styles.card,
        {
          [styles.rounded]: rounded,
        },
        elProps.className,
      )}
    >
      {children}
    </div>
  )
}
