import { App } from 'vue'
import Axios, { AxiosResponse, AxiosRequestConfig, AxiosRequestHeaders } from 'axios'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  // baseURL: '/api',
  baseURL: '',
  timeout: 60 * 1000 // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}

const request = Axios.create(config)

request.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    // Do something before request is sent
    const headers: AxiosRequestHeaders = config?.headers || {}
    headers['Content-Type'] = headers['Content-Type'] || 'application/json;charset=UTF-8'
    config.headers = headers
    // config.headers.Authorization = `Bearer ${localStorage.getItem(USER_TOKEN) || ''}`
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
request.interceptors.response.use(
  function (response: AxiosResponse) {
    // Do something with response data
    const status = +response.status
    if (status === 200 && response.data) {
      const code = +response.data.code
      if (code === 0) {
        return response.data
      } else {
        return Promise.reject(new Error(JSON.stringify(response.data)))
      }
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

export const axios = request

export default {
  install: (app: App) => {
    Object.defineProperties(app.config.globalProperties, {
      $axios: {
        get () {
          return request
        }
      }
    })
  }
}
