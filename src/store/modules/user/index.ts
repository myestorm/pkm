import { 
  State,
  GetterTypes, Getters,
  MutationTypes, Mutations,
  ActionTypes, Actions,
  ModuleType
} from './types'

import { UserSignin, UserInfo, UserSignout } from '../../../apis/user'
import { IUserInfoType, ISigninType } from '../../../../app/types/admin'

import { localStorageToken } from '../../../config'

const emptyUserinfo = {
  username: ''
}

export const state: State = {
  token: localStorage.getItem(localStorageToken) || '',
  userinfo: {
    ...emptyUserinfo
  }
}

export const getters: Getters = {
  [GetterTypes.getToken] (state) {
    return state.token
  },
  [GetterTypes.getUserinfo] (state) {
    return state.userinfo
  }
}

export const mutations: Mutations = {
  [MutationTypes.setToken] (state, token) {
    localStorage.setItem(localStorageToken, token || '')
    state.token = token || ''
  },
  [MutationTypes.setUserinfo] (state, userinfo = { ...emptyUserinfo }) {
    state.userinfo = {
      ...userinfo
    }
  }
}

export const actions: Actions = {
  [ActionTypes.signin] ({ commit }, postData: ISigninType) {
    return new Promise((resolve, reject) => {
      UserSignin(postData).then(res => {
        commit(MutationTypes.setToken, res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.getUserInfo] ({ commit }) {
    return new Promise((resolve, reject) => {
      UserInfo().then(res => {
        commit(MutationTypes.setToken, res.data.token)
        commit(MutationTypes.setUserinfo, res.data.userinfo)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  [ActionTypes.signout] ({ commit }) {
    return new Promise((resolve, reject) => {
      UserSignout().then(res => {
        commit(MutationTypes.setToken, '')
        commit(MutationTypes.setUserinfo, { username: '' })
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
