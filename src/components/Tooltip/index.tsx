import { Provider, Root, Trigger, Portal, Content, Arrow } from '@radix-ui/react-tooltip'
import classNames from 'classnames'
import { FC } from 'react'
import styles from './index.module.scss'

export interface TooltipProps {
  children: React.ReactNode
  trigger: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  contentStyle?: React.CSSProperties
  contentClassName?: string
  disabled?: boolean
  isPopover?: boolean
}
const Tooltip: FC<TooltipProps> = ({
  children,
  trigger,
  placement = 'top',
  open,
  onOpenChange,
  contentStyle,
  contentClassName,
  disabled,
  isPopover = false,
}) => {
  if (disabled) {
    return <>{trigger}</>
  }
  return (
    <Provider delayDuration={0}>
      <Root open={open} onOpenChange={onOpenChange}>
        <Trigger asChild>{trigger}</Trigger>
        <Portal>
          <Content
            side={placement}
            style={contentStyle}
            className={classNames(styles.content, contentClassName, { [styles.popover]: isPopover })}
          >
            <Arrow className={classNames(styles.arrow, { [styles.popoverArrow]: isPopover })} />
            {children}
          </Content>
        </Portal>
      </Root>
    </Provider>
  )
}

export default Tooltip
