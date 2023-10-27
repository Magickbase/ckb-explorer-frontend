import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { SheetPanel, SheetPointPanel, SheetItem } from './styled'
import { useBlockchainAlerts, useNetworkErrMsgs } from '../../services/ExplorerService'

const ALERT_TO_FILTER_OUT = 'CKB v0.105.* have bugs. Please upgrade to the latest version.'

const Sheet = () => {
  const { t } = useTranslation()
  const networkErrMsgs = useNetworkErrMsgs()
  const chainAlerts = useBlockchainAlerts()

  const messages = useMemo<string[]>(
    () => [...chainAlerts.filter(msg => msg !== ALERT_TO_FILTER_OUT), ...networkErrMsgs],
    [chainAlerts, networkErrMsgs],
  )

  return messages.length > 0 ? (
    <SheetPanel>
      {messages.map((context: string, index: number) => {
        const key = index
        return (
          <SheetPointPanel key={key} isSingle={messages.length === 1}>
            {messages.length > 1 && <span>·</span>}
            <SheetItem>{t(context)}</SheetItem>
          </SheetPointPanel>
        )
      })}
    </SheetPanel>
  ) : null
}

export default Sheet
