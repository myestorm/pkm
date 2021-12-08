import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

import knowledge from './modules/knowledge'
import { State, RootState, GetterTypes, Getter, MutationTypes, Mutations } from './types'


export const key: InjectionKey<Store<RootState>> = Symbol()

const state: State | RootState = {
  visibleKnowledge: false
}

const getters: Getter = {
  [GetterTypes.getVisibleKnowledge] (state) {
    return state.visibleKnowledge
  }
}

const actions = {}

const mutations: Mutations = {
  [MutationTypes.setVisibleKnowledge] (state, visibleKnowledge) {
    state.visibleKnowledge = visibleKnowledge
  }
}

const modules = {
  knowledge
}

export const store = createStore<RootState>({
  state,
  getters,
  mutations,
  actions,
  modules
})

export function useStore () {
  return baseUseStore(key)
}
