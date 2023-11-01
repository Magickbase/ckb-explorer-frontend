import { explorerService } from '../../../services/ExplorerService'
import { cacheService } from '../../../services/CacheService'

export const flushCacheInfo = async () => {
  const { flushCacheInfo } = await explorerService.api.fetchFlushChartCache()
  if (flushCacheInfo.length === 0) return

  cacheService.clear()
}

export default flushCacheInfo
