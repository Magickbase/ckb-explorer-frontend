import dayjs from 'dayjs'
import { useSearchParams, useUpdateSearchParams } from '../../../hooks'
import { ExportPage } from '../../../components/ExportPage'
import { explorerService } from '../../../services/ExplorerService'

const ExportNervosDaoTransactions = () => {
  const {
    tab = 'date',
    'start-date': startDateStr,
    'end-date': endDateStr,
    'from-height': fromHeightStr,
    'to-height': toHeightStr,
  } = useSearchParams('tab', 'start-date', 'end-date', 'from-height', 'to-height')

  const startDate = tab === 'date' && startDateStr ? dayjs(startDateStr) : undefined
  const endDate = tab === 'date' && endDateStr ? dayjs(endDateStr) : undefined

  const fromHeight = tab === 'height' && fromHeightStr !== undefined ? parseInt(fromHeightStr, 10) : undefined
  const toHeight = tab === 'height' && toHeightStr !== undefined ? parseInt(toHeightStr, 10) : undefined

  const updateSearchParams = useUpdateSearchParams<'tab' | 'start-date' | 'end-date' | 'from-height' | 'to-height'>()

  return (
    <ExportPage
      fetchCSVData={params =>
        explorerService.api.fetchNervosDaoTransactionsCsv({
          startDate: params.startDate,
          endDate: params.endDate,
          startNumber: params.fromHeight,
          endNumber: params.toHeight,
        })
      }
      csvFileName="exported-nervosdao-txs"
      defaultParams={{
        tab,
        startDate: startDate?.valueOf(),
        endDate: endDate?.valueOf(),
        fromHeight,
        toHeight,
      }}
      handleParamsChanged={params => {
        updateSearchParams(
          p => ({
            ...p,
            tab: params.tab,
            ...(params.tab === 'date'
              ? {
                  'start-date': params.startDate ? dayjs(params.startDate).format('YYYY-MM-DD') : undefined,
                  'end-date': params.endDate ? dayjs(params.endDate).format('YYYY-MM-DD') : undefined,
                }
              : {}),
            ...(params.tab === 'height'
              ? {
                  'from-height': params.fromHeight ? params.fromHeight.toString() : undefined,
                  'to-height': params.toHeight ? params.toHeight.toString() : undefined,
                }
              : {}),
          }),
          true,
        )
      }}
    />
  )
}

export default ExportNervosDaoTransactions
