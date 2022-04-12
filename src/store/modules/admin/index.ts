import { defineStore } from 'pinia'
import { AdminState } from './types'

import { localStorageToken } from '../../../config'
import { ISigninType } from '../../../../types/admin'
import { AdminInfo, AdminSignin, AdminSignout } from '../../../apis/admin'

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
    signin (postData: ISigninType) {
      return new Promise((resolve, reject) => {
        AdminSignin(postData).then(res => {
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
        AdminSignout().then(res => {
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
        AdminInfo().then(res => {
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
    }
  }
})
export default useStore
