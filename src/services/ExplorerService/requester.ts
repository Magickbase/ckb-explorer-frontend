import { BehaviorSubject } from 'rxjs'
import CONFIG from '../../config'

export const networkErrMsgs$ = new BehaviorSubject<string[]>([])

// 定义兼容 axios 的接口类型
interface AxiosRequestConfig {
  method?: string
  url?: string
  baseURL?: string
  headers?: Record<string, string>
  data?: any
  params?: Record<string, any>
}

interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: AxiosRequestConfig
}

export interface AxiosError<T = any> extends Error {
  response?: AxiosResponse<T>
  config: AxiosRequestConfig
  isAxiosError: true
}

// 创建兼容 axios 的 fetch 客户端
class FetchClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(config: { baseURL: string; headers?: Record<string, string> }) {
    this.baseURL = config.baseURL
    this.defaultHeaders = config.headers || {}
  }

  // 构建完整 URL
  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`

    if (!params) return fullURL

    const urlObj = new URL(fullURL)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        urlObj.searchParams.append(key, String(value))
      }
    })

    return urlObj.toString()
  }

  // 处理网络错误
  private handleNetworkError(error: AxiosError<{ message: string }>) {
    if (error && error.response && error.response.data) {
      const { message } = error.response.data
      switch (error.response.status) {
        case 503:
          this.updateNetworkError(message || undefined)
          break
        case 422:
        case 404:
        case 400:
          break
        case 429:
          this.updateNetworkError('toast.too_many_request')
          break
        default:
          this.updateNetworkError()
          break
      }
    } else {
      this.updateNetworkError()
    }
  }

  // 更新网络错误消息
  private updateNetworkError(errMessage = 'toast.invalid_network') {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
      networkErrMsgs$.next([])
      this.timeout = null
    }, 2000)
    networkErrMsgs$.next([errMessage])
  }

  private timeout: ReturnType<typeof setTimeout> | null = null

  // 通用请求方法
  private async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const { method = 'GET', url = '', data, params, headers = {} } = config

      // 请求拦截器逻辑：为 GET 请求添加 unused 数据
      let requestData = data
      if (method.toLowerCase() === 'get') {
        requestData = {
          unused: 0,
        }
      }

      // 构建请求配置
      const requestConfig: RequestInit = {
        method: method.toUpperCase(),
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
      }

      // 处理请求体
      if (requestData && method.toUpperCase() !== 'GET') {
        if (typeof requestData === 'object') {
          requestConfig.body = JSON.stringify(requestData)
        } else {
          requestConfig.body = requestData
        }
      }

      // 发送请求
      const response = await fetch(this.buildURL(url, params), requestConfig)

      // 解析响应数据
      let responseData: T
      const contentType = response.headers.get('content-type')
      if (
        contentType &&
        (contentType.includes('application/json') || contentType.includes('application/vnd.api+json'))
      ) {
        responseData = await response.json()
      } else {
        responseData = (await response.text()) as T
      }

      // 构建 axios 兼容的响应对象
      const axiosResponse: AxiosResponse<T> = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        config,
      }

      // 检查响应状态
      if (!response.ok) {
        const error: AxiosError = new Error(`Request failed with status ${response.status}`) as AxiosError
        error.response = axiosResponse
        error.config = config
        throw error
      }

      return axiosResponse
    } catch (error) {
      // 处理错误
      const axiosError = error as AxiosError
      axiosError.isAxiosError = true
      if (!axiosError.response) {
        axiosError.config = config
      }

      // 响应拦截器逻辑：处理网络错误
      this.handleNetworkError(axiosError)
      throw axiosError
    }
  }

  // GET 请求
  async get<T = any>(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' })
  }

  // POST 请求
  async post<T = any>(
    url: string,
    data?: any,
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, url, method: 'POST', data })
  }

  // PUT 请求
  async put<T = any>(
    url: string,
    data?: any,
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', data })
  }

  // DELETE 请求
  async delete<T = any>(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' })
  }

  // 直接调用方法（兼容某些用法）
  async call<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, url })
  }
}

// 创建兼容 axios.create 的函数
const createFetchClient = (config: { baseURL: string; headers?: Record<string, string>; data?: any }) => {
  return new FetchClient(config)
}

export const requesterV1 = createFetchClient({
  baseURL: `${CONFIG.API_URL}/api/v1/`,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  data: null,
})

export const requesterV2 = createFetchClient({
  baseURL: `${CONFIG.API_URL}/api/v2/`,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  data: null,
})
