import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { State, RootState, GetterTypes, Getter, MutationTypes, Mutations } from './types'

import knowledge from './modules/knowledge/index'
import recycle from './modules/recycle/index'
import admin from './modules/admin/index'
import bookrack from './modules/bookrack/index'

export const key: InjectionKey<Store<RootState>> = Symbol()

const state: State = {
  visibleKnowledge: false,
  knowledgeForm: {
    title: '',
    desc: '',
    thumb: '',
    isDefault: false,
    order: 99
  }
}

const getters: Getter = {
  [GetterTypes.getVisibleKnowledge] (state) {
    return state.visibleKnowledge
  },
  [GetterTypes.getKnowledgeForm] (state) {
    return state.knowledgeForm
  }
}

const mutations: Mutations = {
  [MutationTypes.setVisibleKnowledge] (state, visibleKnowledge) {
    state.visibleKnowledge = visibleKnowledge
  },
  [MutationTypes.setKnowledgeForm] (state, knowledgeForm) {
    state.knowledgeForm = {
      ...knowledgeForm
    }
  }
}

export const store = createStore<RootState>({
  state,
  getters,
  mutations
})

store.registerModule('knowledge', knowledge)
store.registerModule('recycle', recycle)
store.registerModule('admin', admin)
store.registerModule('bookrack', bookrack)

export function useStore () {
  return baseUseStore(key)
}
