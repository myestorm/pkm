import { defineStore } from 'pinia'
import { NavigationState, breadcrumbType } from './types'

const useStore = defineStore('navigation', {
  state: (): NavigationState => ({
    sitename: 'Personal Knowledge Management - Totonoo',
    breadcrumbs: [],
    computerNav: [],
    mobileNav: [],
    computerCurrent: -1,
    mobileCurrent: 0
  }),

  actions: {
  }
})
export default useStore
