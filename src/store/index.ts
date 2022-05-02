import { defineStore } from 'pinia'
import { CommonState } from './types'
import { localStorageTheme } from '@/config/index'
import { axios } from '@/plugins/axios'
import { AxiosRequestConfig } from 'axios'
import * as TypesBase from '@/types/base'

const _theme = localStorage.getItem(localStorageTheme) || 'light'
if (_theme === 'dark') {
  document.body.setAttribute('arco-theme', 'dark')
} else {
  document.body.removeAttribute('arco-theme')
}

const useStore = defineStore('index', {
  state: (): CommonState => ({
    sitename: 'Personal Knowledge Management - Totonoo',
    system: {
      userAgent: navigator.userAgent.toLowerCase(),
      isMobile: /Mobi|Android|iPhone/i.test(navigator.userAgent)
    },
    theme: _theme,
    breadcrumbs: [],
    navigation: [],
    currentNav: -1,
    mobile: {
      breadcrumbs: [],
      navigation: [],
      currentNav: -1
    }
  }),

  getters: {
    getUserAgent (state: CommonState): string {
      return state.system.userAgent
    },
    getIsMobile (state: CommonState): boolean {
      return state.system.isMobile
    }
  },

  actions: {
    setTheme (theme: string) {
      this.theme = theme
      localStorage.setItem(localStorageTheme, this.theme)
    },
    searchAll (keyword: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBase.ISearchAllDataType>> {
      return axios.get<undefined, TypesBase.IResponeBodyType<TypesBase.ISearchAllDataType>>(`/api/search/${keyword}`, options)
    },
    recent (options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBase.ISearchAllDataType>> {
      return axios.get<undefined, TypesBase.IResponeBodyType<TypesBase.ISearchAllDataType>>(`/api/recent`, options)
    }
  }
})
export default useStore
