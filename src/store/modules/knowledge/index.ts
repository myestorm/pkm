import { 
  State,
  GetterTypes, Getter,
  MutationTypes, Mutations,
  ActionTypes, Actions
} from './types'

import { ApiKnowledge, ApiKnowledgeInfoId } from '../../../apis/index'

export const state: State = {
  list: [],
  selected: null
}

export const getter: Getter = {
  [GetterTypes.getList] (state) {
    return state.list
  },
  [GetterTypes.getSelected] (state) {
    return state.selected
  }
}

export const mutations: Mutations = {
  [MutationTypes.setList] (state, list) {
    console.log(state, list)
    state.list = list || []
  },
  [MutationTypes.setSelected] (state, selected) {
    state.selected = selected || null
  }
}

export const actions: Actions = {
  [ActionTypes.getList] ({ commit }) {
    return new Promise((resolve, reject) => {
      ApiKnowledge().then(res => {
        commit('setList', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.getInfo] (_, id: string) {
    return new Promise((resolve, reject) => {
      ApiKnowledgeInfoId(id).then(res => {
        resolve(res.data)
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
