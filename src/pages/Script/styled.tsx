import { Tabs } from 'antd'
import TabPane from 'antd/lib/tabs/TabPane'
import styled from 'styled-components'

export const ScriptTab = styled(Tabs)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background-color: #fff;
  border-radius: 6px 6px 0 0;
`
export const ScriptTabTitle = styled.span`
  font-size: 20px;
`

export const ScriptTabPane = styled(TabPane)`
  color: #333;
`
