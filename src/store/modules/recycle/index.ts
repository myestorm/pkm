import { 
  State,
  GetterTypes, Getters,
  MutationTypes, Mutations,
  ActionTypes, Actions,
  ModuleType
} from './types'

import { ApiRecycle, ApiRecycleRemoveAll, ApiRecycleRemove } from '../../../apis/index'

export const state: State = {
  list: []
}

export const getters: Getters = {
  [GetterTypes.getList] (state) {
    return state.list
  }
}

export const mutations: Mutations = {
  [MutationTypes.setList] (state, list = []) {
    state.list = [ ...list ]
  }
}

export const actions: Actions = {
  [ActionTypes.getList] ({ commit }) {
    return new Promise((resolve, reject) => {
      ApiRecycle().then(res => {
        commit('setList', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.removeAll] ({ commit }) {
    return new Promise((resolve, reject) => {
      ApiRecycleRemoveAll().then(res => {
        commit('setList', [])
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.remove] ({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiRecycleRemove(data).then(res => {
        dispatch(ActionTypes.getList)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
}

const module: ModuleType =  {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default module
