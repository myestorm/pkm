import { 
  State,
  GetterTypes, Getters,
  MutationTypes, Mutations,
  ActionTypes, Actions,
  ModuleType
} from './types'

import { ApiKnowledge, ApiKnowledgeInfoId, ApiKnowledgeAdd, ApiKnowledgeUpdate, ApiKnowledgeRemove } from '../../../apis/index'

export const state: State = {
  list: [],
  selected: null
}

export const getters: Getters = {
  [GetterTypes.getList] (state) {
    return state.list
  },
  [GetterTypes.getSelected] (state) {
    return state.selected
  }
}

export const mutations: Mutations = {
  [MutationTypes.setList] (state, list) {
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
  },
  [ActionTypes.add] ({ commit, state }, postData) {
    return new Promise((resolve, reject) => {
      ApiKnowledgeAdd(postData).then(res => {
        const list = [...state.list]
        list.unshift(res.data)
        commit('setList', list)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.update] ({ commit, state }, postData) {
    return new Promise((resolve, reject) => {
      ApiKnowledgeUpdate(postData).then(res => {
        const data = res.data
        const list = [...state.list]
        const index = list.findIndex(i => i._id === data._id)
        list[index] = { ...data }
        commit('setList', list)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.remove] ({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      ApiKnowledgeRemove(id).then(res => {
        const list = [...state.list]
        const index = list.findIndex(i => i._id === id)
        list.splice(index, 1)
        commit('setList', list)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const module: ModuleType =  {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default module
