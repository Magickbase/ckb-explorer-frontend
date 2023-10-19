import { ReactNode } from 'react'
import styled from 'styled-components'

const ButtonPanel = styled.div`
  cursor: pointer;
`

export default ({
  id,
  className,
  onClick,
  onMouseOver,
  children,
}: {
  id?: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  onMouseOver?: React.MouseEventHandler<HTMLDivElement>
  children: ReactNode | string
}) => (
  <ButtonPanel
    id={id}
    className={className}
    role="button"
    tabIndex={-1}
    onKeyDown={() => {}}
    onMouseOver={event => {
      if (onMouseOver) {
        onMouseOver(event)
      }
    }}
    onClick={event => {
      if (onClick) {
        onClick(event)
      }
    }}
  >
    {children}
  </ButtonPanel>
)
