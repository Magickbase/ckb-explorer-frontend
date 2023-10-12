import { useState } from 'react'
import i18next from 'i18next'
import { FLUSH_CHART_CACHE_POLLING_TIME } from '../../constants/common'
import { useInterval } from '../../utils/hook'
import flushCacheInfo from '../../service/app/charts/cache'
import { dayjs } from '../../utils/date'

export const useInitApp = () => {
  const [init, setInit] = useState(false)

  if (!init) {
    initDayjs()
    setInit(true)
    flushCacheInfo()
  }

  useInterval(() => {
    flushCacheInfo()
  }, FLUSH_CHART_CACHE_POLLING_TIME)
}

export const initDayjs = () => {
  const en = i18next.getFixedT('en')
  const zh = i18next.getFixedT('zh')
  const localeList = dayjs.Ls
  dayjs.updateLocale('zh-cn', {
    relativeTime: {
      ...localeList['zh-cn'].relativeTime,
      s: `%d ${en('common.seconds_unit')}`,
      m: `%d ${en('common.minute')}`,
      past: `%s ${en('common.ago')}`,
    },
  })
  dayjs.updateLocale('en', {
    relativeTime: {
      ...localeList.en.relativeTime,
      s: `%d ${zh('common.seconds_unit')}`,
      m: `%d ${zh('common.minute')}`,
      past: `%s ${zh('common.ago')}`,
    },
  })
}

export default useInitApp
