import React from 'react'
import { PagePanel } from './styled'

export default ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <PagePanel style={style}>{children}</PagePanel>
)
