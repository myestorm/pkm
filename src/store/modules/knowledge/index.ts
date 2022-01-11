import { 
  State,
  GetterTypes, Getters,
  MutationTypes, Mutations,
  ActionTypes, Actions,
  ModuleType
} from './types'

import { 
  KnowledgeList,
  KnowledgeInfoId, 
  KnowledgeDocumentId, 
  KnowledgeSetDefaultId, 
  KnowledgeAdd,
  KnowledgeUpdate,
  KnowledgeRemove,
  DocumentUpdate,
  DocumentAdd,
  DocumentRemove,
  DocumentTransfer,
  KnowledgeOrder,
  DocumentOrder
} from '../../../apis/knowledge'
import { IKnowledgeDocType, IStoreKnowledgeDocAddType, IStoreKnowledgeDocUpdateType } from '../../../../types/knowledge'

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
  [MutationTypes.setList] (state, list = []) {
    state.list = [ ...list ]
  },
  [MutationTypes.setSelected] (state, selected) {
    state.selected = selected || null
  }
}

export const actions: Actions = {
  [ActionTypes.getList] ({ commit }) {
    return new Promise((resolve, reject) => {
      KnowledgeList().then(res => {
        commit('setList', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.getInfo] (_, data: { id: string, hasChildren?: number }) {
    return new Promise((resolve, reject) => {
      KnowledgeInfoId(data).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.getDocsByid] (_, id: string) {
    return new Promise((resolve, reject) => {
      KnowledgeDocumentId(id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.setDefault] (_, id: string) {
    return new Promise((resolve, reject) => {
      KnowledgeSetDefaultId(id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.add] ({ dispatch }, postData) {
    return new Promise((resolve, reject) => {
      KnowledgeAdd(postData).then(res => {
        dispatch(ActionTypes.getList)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.update] ({ dispatch }, postData) {
    return new Promise((resolve, reject) => {
      KnowledgeUpdate(postData).then(res => {
        dispatch(ActionTypes.getList)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.remove] ({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      KnowledgeRemove(id).then(res => {
        dispatch(ActionTypes.getList)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.addDoc] (_, postData: IStoreKnowledgeDocAddType) {
    return new Promise((resolve, reject) => {
      DocumentAdd(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.updateDoc] (_, postData: IStoreKnowledgeDocUpdateType) {
    return new Promise((resolve, reject) => {
      DocumentUpdate(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.removeDoc] (_, postData: { kid: string, id: string }) {
    return new Promise((resolve, reject) => {
      DocumentRemove(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.transferDoc] (_, postData: { fid: string, tid: string, id: string }) {
    return new Promise((resolve, reject) => {
      DocumentTransfer(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.setOrder] (_, postData: { id: string, order: number }) {
    return new Promise((resolve, reject) => {
      KnowledgeOrder(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.setOrderDoc] (_, postData: { id: string, did: string, order: number }) {
    return new Promise((resolve, reject) => {
      DocumentOrder(postData).then(res => {
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
