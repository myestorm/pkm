import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  count: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state () {
    return {
      count: 0
    }
  },
  getters: {},
  mutations: {
    add (state) {
      state.count ++
    }
  },
  actions: {},
  modules: {
  }
})

export function useStore () {
  return baseUseStore(key)
}
