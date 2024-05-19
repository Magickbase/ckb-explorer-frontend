/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react'
import classnames from 'classnames'
import styles from './Alert.module.scss'

// const alertVariants = cva(
//   'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
//   {
//     variants: {
//       variant: {
//         default: 'bg-background text-foreground',
//         destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//     },
//   },
// )

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'destructive'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={classnames(styles.alert, className, {
      [styles.default]: variant === 'default',
      [styles.destructive]: variant === 'destructive',
    })}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={classnames(styles.alertTitle, className)} {...props}>
      {children}
    </div>
  ),
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classnames(styles.alertDescription, className)} {...props} />
  ),
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
