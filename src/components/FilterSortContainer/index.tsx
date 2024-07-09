import classNames from 'classnames'
import { ComponentProps, FC, ReactNode } from 'react'
import styles from './index.module.scss'

export const FilterSortContainerOnMobile: FC<ComponentProps<'div'>> = ({ children, ...elProps }) => {
  return (
    <div {...elProps} className={classNames(styles.filterSortContainerOnMobile, elProps.className)}>
      <ul>
        {Array.from(children as Iterable<ReactNode>).map(child => (
          <li>{child}</li>
        ))}
      </ul>
    </div>
  )
}
