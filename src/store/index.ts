import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

import knowledge from './modules/knowledge/index'
import { State, RootState, GetterTypes, Getter, MutationTypes, Mutations } from './types'


export const key: InjectionKey<Store<RootState>> = Symbol()

const state: State = {
  visibleKnowledge: false,
  knowledgeForm: {
    title: ''
  },
  visibleSelectKnowledge: false
}

const getters: Getter = {
  [GetterTypes.getVisibleKnowledge] (state) {
    return state.visibleKnowledge
  },
  [GetterTypes.getKnowledgeForm] (state) {
    return state.knowledgeForm
  },
  [GetterTypes.getVisibleSelectKnowledge] (state) {
    return state.visibleSelectKnowledge
  },
}

const mutations: Mutations = {
  [MutationTypes.setVisibleKnowledge] (state, visibleKnowledge) {
    state.visibleKnowledge = visibleKnowledge
  },
  [MutationTypes.setKnowledgeForm] (state, knowledgeForm) {
    state.knowledgeForm = knowledgeForm
  },
  [MutationTypes.setVisibleSelectKnowledge] (state, visibleSelectKnowledge) {
    state.visibleSelectKnowledge = visibleSelectKnowledge
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
