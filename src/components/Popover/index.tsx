import { Root, Trigger, Portal, Content, Arrow } from '@radix-ui/react-popover'
import classNames from 'classnames'
import { FC } from 'react'
import styles from './index.module.scss'
import { useIsMobile } from '../../hooks'
import Tooltip from '../Tooltip'

export interface TooltipProps {
  children: React.ReactNode
  trigger: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  contentStyle?: React.CSSProperties
  contentClassName?: string
  disabled?: boolean
}
const Popover: FC<TooltipProps> = ({
  children,
  trigger,
  placement = 'bottom',
  open,
  onOpenChange,
  contentStyle,
  contentClassName,
  disabled,
}) => {
  const isMobile = useIsMobile()

  if (disabled) {
    return <>{trigger}</>
  }
  if (!isMobile) {
    return (
      <Tooltip
        trigger={trigger}
        placement={placement}
        open={open}
        onOpenChange={onOpenChange}
        contentStyle={contentStyle}
        contentClassName={contentClassName}
        isPopover
      >
        {children}
      </Tooltip>
    )
  }
  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <Trigger asChild>{trigger}</Trigger>
      <Portal>
        <Content side={placement} style={contentStyle} className={classNames(styles.content, contentClassName)}>
          <Arrow className={styles.arrow} />
          {children}
        </Content>
      </Portal>
    </Root>
  )
}

export default Popover
