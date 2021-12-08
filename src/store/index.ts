import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

import knowledge from './modules/knowledge/index'
import { State, RootState, GetterTypes, Getter, MutationTypes, Mutations } from './types'


export const key: InjectionKey<Store<RootState>> = Symbol()

const state: State = {
  visibleKnowledge: false
}

const getters: Getter = {
  [GetterTypes.getVisibleKnowledge] (state) {
    return state.visibleKnowledge
  }
}

const mutations: Mutations = {
  [MutationTypes.setVisibleKnowledge] (state, visibleKnowledge) {
    state.visibleKnowledge = visibleKnowledge
  }
}

export const store = createStore<RootState>({
  state,
  getters,
  mutations
})

store.registerModule('knowledge', knowledge)

export function useStore () {
  return baseUseStore(key)
}
