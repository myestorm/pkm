import { 
  KnowledgeState,
  KnowledgeGetterTypes, KnowledgeGetter,
  KnowledgeMutationTypes, KnowledgeMutations,
  KnowledgeActionTypes, KnowledgeActions
} from './types'

import { ApiKnowledge } from '../../apis/index'

export const state: KnowledgeState = {
  list: 0
}

export const getter: KnowledgeGetter = {
  [KnowledgeGetterTypes.getList] (state) {
    return state.list
  }
}

export const mutations: KnowledgeMutations = {
  [KnowledgeMutationTypes.setList] (state, list) {
    state.list = list
  }
}

export const actions: KnowledgeActions = {
  [KnowledgeActionTypes.getList] ({ commit }) {
    return new Promise((resolve, reject) => {
      ApiKnowledge().then(res => {
        commit('setList', res.data)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getter,
  mutations,
  actions
}
