import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { State, RootState, GetterTypes, Getter, MutationTypes, Mutations } from './types'

import knowledge from './modules/knowledge/index'
import recycle from './modules/recycle/index'
import admin from './modules/admin/index'
import bookrack from './modules/bookrack/index'

export const key: InjectionKey<Store<RootState>> = Symbol()

const state: State = {
  system: {
    userAgent: navigator.userAgent.toLowerCase(),
    isMobile: /Mobi|Android|iPhone/i.test(navigator.userAgent)
  },
  mobile: {
    current: 0
  },
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
  },
  [GetterTypes.getUserAgent] (state) {
    return state.system.userAgent
  },
  [GetterTypes.getIsMobile] (state) {
    return state.system.isMobile
  },
  [GetterTypes.getMobileCurrent] (state) {
    return state.mobile.current
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
  },
  [MutationTypes.setMobileCurrent] (state, current) {
    state.mobile.current = current || 0
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
