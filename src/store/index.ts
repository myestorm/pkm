import { defineStore } from 'pinia'
import { CommonState } from './types'
import { localStorageTheme } from '../config/index'

const _theme = localStorage.getItem(localStorageTheme) || 'light'
if (_theme === 'dark') {
  document.body.setAttribute('arco-theme', 'dark')
} else {
  document.body.removeAttribute('arco-theme')
}

const useStore = defineStore('user', {
  state: (): CommonState => ({
    system: {
      userAgent: navigator.userAgent.toLowerCase(),
      isMobile: /Mobi|Android|iPhone/i.test(navigator.userAgent)
    },
    theme: _theme
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
    setIsMobile (isMobile: boolean) {
      this.system.isMobile = isMobile
    },
    setTheme (theme: string) {
      this.theme = theme
      localStorage.setItem(localStorageTheme, this.theme)
    }
  }
})
export default useStore
