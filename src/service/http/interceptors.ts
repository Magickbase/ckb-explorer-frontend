import { AxiosError } from 'axios'
import { axiosIns } from './fetcher'
import { I18nType } from '../../utils/i18n'
import { setNetworkErrMsgs } from '../../components/Sheet'

let timeout: ReturnType<typeof setTimeout> | null

const updateNetworkError = (i18n: I18nType, errMessage = 'toast.invalid_network') => {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    setNetworkErrMsgs([])
    timeout = null
  }, 2000)
  setNetworkErrMsgs([i18n.t(errMessage)])
}

export const initAxiosInterceptors = (i18n: I18nType) => {
  axiosIns.interceptors.request.use(
    config => {
      if (config.method === 'get') {
        // eslint-disable-next-line no-param-reassign
        config.data = {
          unused: 0,
        }
      }
      return config
    },
    error => Promise.reject(error),
  )

  axiosIns.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      if (error && error.response && error.response.data) {
        const { message }: { message: string } = error.response.data
        switch (error.response.status) {
          case 503:
            updateNetworkError(i18n, message || undefined)
            break
          case 422:
          case 404:
          case 400:
            break
          case 429:
            updateNetworkError(i18n, 'toast.too_many_request')
            break
          default:
            updateNetworkError(i18n)
            break
        }
      } else {
        updateNetworkError(i18n)
      }
      return Promise.reject(error)
    },
  )
}

export default initAxiosInterceptors
