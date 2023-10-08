import { useState } from 'react'
import { initAxiosInterceptors } from '../../service/http/interceptors'
import { FLUSH_CHART_CACHE_POLLING_TIME } from '../../constants/common'
import { useI18n } from '../../utils/i18n'
import { useInterval } from '../../utils/hook'
import flushCacheInfo from '../../service/app/charts/cache'

export const useInitApp = () => {
  const { i18n } = useI18n()
  const [init, setInit] = useState(false)

  if (!init) {
    setInit(true)
    initAxiosInterceptors(i18n)
    flushCacheInfo()
  }

  useInterval(() => {
    flushCacheInfo()
  }, FLUSH_CHART_CACHE_POLLING_TIME)
}

export default useInitApp
