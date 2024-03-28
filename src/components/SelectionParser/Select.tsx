import React from 'react'
import * as Select from '@radix-ui/react-select'
import classnames from 'classnames'

import styles from './select.module.scss'

interface MySelectProps extends Select.SelectProps {
  options: { value: string; label: string }[]
  placeholder?: string
  container?: Select.PortalProps['container']
}

const MySelect = ({ placeholder, options, container, ...props }: MySelectProps) => (
  <Select.Root {...props}>
    <Select.Trigger className={styles.selectTrigger} aria-label="Food">
      <Select.Value placeholder={placeholder} />
      <Select.Icon className={styles.selectIcon} />
    </Select.Trigger>
    <Select.Portal container={container}>
      <Select.Content position="popper" className={styles.selectContent}>
        <Select.ScrollUpButton className={styles.SelectScrollButton} />
        <Select.Viewport className={styles.selectViewport}>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton className={styles.selectScrollButton} />
      </Select.Content>
    </Select.Portal>
  </Select.Root>
)

const SelectItem: React.FC<React.PropsWithChildren<Select.SelectItemProps>> = ({ children, className, ...props }) => {
  return (
    <Select.Item className={classnames(styles.selectItem, className)} {...props}>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
}

export default MySelect
