import { 
  State,
  GetterTypes, Getters,
  MutationTypes, Mutations,
  ActionTypes, Actions,
  ModuleType
} from './types'

import { 
  ApiKnowledge,
  ApiKnowledgeInfoId, 
  ApiKnowledgeDocumentId, 
  ApiKnowledgeSetDefaultId, 
  ApiKnowledgeAdd,
  ApiKnowledgeUpdate,
  ApiKnowledgeRemove,
  ApiDocumentUpdate,
  ApiDocumentAdd,
  ApiDocumentRemove,
  ApiDocumentTransfer
} from '../../../apis/index'
import { IKnowledgeDocType } from '../../../../app/types/knowledge'

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
      ApiKnowledge().then(res => {
        commit('setList', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.getInfo] (_, data: { id: string, hasChildren?: number }) {
    return new Promise((resolve, reject) => {
      ApiKnowledgeInfoId(data).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.getDocsByid] (_, id: string) {
    return new Promise((resolve, reject) => {
      ApiKnowledgeDocumentId(id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.setDefault] (_, id: string) {
    return new Promise((resolve, reject) => {
      ApiKnowledgeSetDefaultId(id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.add] ({ dispatch }, postData) {
    return new Promise((resolve, reject) => {
      ApiKnowledgeAdd(postData).then(res => {
        dispatch(ActionTypes.getList)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.update] ({ dispatch }, postData) {
    return new Promise((resolve, reject) => {
      ApiKnowledgeUpdate(postData).then(res => {
        dispatch(ActionTypes.getList)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.remove] ({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      ApiKnowledgeRemove(id).then(res => {
        dispatch(ActionTypes.getList)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.addDoc] (_, postData: IKnowledgeDocType & { kid?: string}) {
    return new Promise((resolve, reject) => {
      ApiDocumentAdd(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.updateDoc] (_, postData: IKnowledgeDocType & { kid?: string}) {
    return new Promise((resolve, reject) => {
      ApiDocumentUpdate(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.removeDoc] (_, postData: { kid: string, id: string }) {
    return new Promise((resolve, reject) => {
      ApiDocumentRemove(postData).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.transferDoc] (_, postData: { fid: string, tid: string, id: string }) {
    return new Promise((resolve, reject) => {
      ApiDocumentTransfer(postData).then(res => {
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
