import { defineStore } from 'pinia'
import { CommonState } from './types'

const useStore = defineStore('user', {
  state: (): CommonState => ({
    system: {
      userAgent: navigator.userAgent.toLowerCase(),
      isMobile: /Mobi|Android|iPhone/i.test(navigator.userAgent)
    },
    mobile: {
      current: 0
    }
  }),

  getters: {
    getUserAgent (state: CommonState): string {
      return state.system.userAgent
    },
    getIsMobile (state: CommonState): boolean {
      return state.system.isMobile
    },
    getMobileCurrent (state: CommonState): number {
      return state.mobile.current
    }
  },

  actions: {
    setIsMobile (isMobile: boolean) {
      this.system.isMobile = isMobile
    },
    setMobileCurrent (current: number) {
      this.mobile.current = current
    }
  }
})
export default useStore
