import { 
  State,
  GetterTypes, Getters,
  MutationTypes, Mutations,
  ActionTypes, Actions,
  ModuleType
} from './types'

import { 
  BookrackList,
  BookrackAdd,
  BookrackUpdate,
  BookrackDelete,
  IBookrackGroupAddType,
  IBookrackGroupUpdateType
} from '../../../apis/bookrack'

export const state: State = {
  list: [],
  selected: null
}

export const getters: Getters = {
}

export const mutations: Mutations = {
}

export const actions: Actions = {
  [ActionTypes.bookrackList] () {
    return new Promise((resolve, reject) => {
      BookrackList().then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.bookrackAdd] (_, postData: IBookrackGroupAddType) {
    return new Promise((resolve, reject) => {
      BookrackAdd(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.bookrackUpdate] (_, postData: IBookrackGroupUpdateType) {
    return new Promise((resolve, reject) => {
      BookrackUpdate(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.bookrackDelete] (_, id: string) {
    return new Promise((resolve, reject) => {
      BookrackDelete(id).then(res => {
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
