import classNames from 'classnames'
import { ComponentProps, FC, ReactNode } from 'react'
import styles from './index.module.scss'

export const FilterSortContainerOnMobile: FC<ComponentProps<'div'>> = ({ children, ...elProps }) => {
  const { left, right } = Array.from(children as Iterable<ReactNode>).reduce<{ left: ReactNode[]; right: ReactNode[] }>(
    (acc, child, index) => {
      if (index % 2 === 0) {
        acc.left.push(child)
      } else {
        acc.right.push(child)
      }
      return acc
    },
    { left: [], right: [] },
  )

  return (
    <div {...elProps} className={classNames(styles.filterSortContainerOnMobile, elProps.className)}>
      <div className={styles.col}>{left}</div>
      <div className={styles.col}>{right}</div>
    </div>
  )
}
