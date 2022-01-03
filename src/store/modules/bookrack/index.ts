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
  BookrackRemove,
  BookList,
  BookAdd,
  BookUpdate,
  BookRemove
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
  [ActionTypes.bookrackAdd] (_, postData) {
    return new Promise((resolve, reject) => {
      BookrackAdd(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.bookrackUpdate] (_, postData) {
    return new Promise((resolve, reject) => {
      BookrackUpdate(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.bookrackRemove] (_, id: string) {
    return new Promise((resolve, reject) => {
      BookrackRemove(id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.bookList] (_, gid: string) {
    return new Promise((resolve, reject) => {
      BookList(gid).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.bookAdd] (_, postData) {
    return new Promise((resolve, reject) => {
      BookAdd(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.bookUpdate] (_, postData) {
    return new Promise((resolve, reject) => {
      BookUpdate(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.bookRemove] (_, data) {
    return new Promise((resolve, reject) => {
      BookRemove(data).then(res => {
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
