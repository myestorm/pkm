import { defineStore } from 'pinia'
import { AdminState } from './types'

import { localStorageToken } from '../../../config'
import * as TypesAdmin from '../../../../types/admin'
import * as ApiAdmin from '../../../apis/admin'

const emptyUserinfo = {
  _id: '',
  username: '',
  mobile: '',
  avatar: '',
  nickname: '',
  email: '',
  root: false,
  status: 1,
  createdBy: '',
  createdAt: new Date(),
  updatedBy: '',
  updatedAt: new Date()
}

const useStore = defineStore('admin', {
  state: (): AdminState => ({
    token: localStorage.getItem(localStorageToken) || '',
    userinfo: {
      ...emptyUserinfo
    }
  }),

  actions: {
    signin (postData: TypesAdmin.ISigninType) {
      return new Promise((resolve, reject) => {
        ApiAdmin.AdminSignin(postData).then(res => {
          this.token = res.data || ''
          localStorage.setItem(localStorageToken, this.token)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },

    signout () {
      return new Promise((resolve, reject) => {
        ApiAdmin.AdminSignout().then(res => {
          this.token = ''
          this.userinfo = emptyUserinfo
          localStorage.setItem(localStorageToken, this.token)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },

    getUserinfo () {
      return new Promise((resolve, reject) => {
        ApiAdmin.AdminInfo().then(res => {
          const token = res.data.token
          const userinfo = res.data.userinfo
          this.token = token
          this.userinfo = Object.assign(emptyUserinfo, userinfo)
          localStorage.setItem(localStorageToken, this.token)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },

    list () {
      return ApiAdmin.AdminList()
    },

    add (postData: TypesAdmin.IApiAdminAddType) {
      return ApiAdmin.AdminAdd(postData)
    },

    resetPassword (id: string) {
      return ApiAdmin.AdminResetPassword(id)
    },

    disabled (id: string, status: number) {
      return ApiAdmin.AdminDisabled(id, status)
    },

    updateSelfPassword (postData: TypesAdmin.IApiAdminUpdateSelfPasswordType) {
      return ApiAdmin.AdminUpdateSelfPassword(postData)
    },

    updateSelfInfo (postData: TypesAdmin.IApiAdminUpdateSelfInfoType) {
      return ApiAdmin.AdminUpdateSelfInfo(postData)
    }
  }
})
export default useStore
