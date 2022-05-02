import { defineStore } from 'pinia'
import { AdminState } from './types'

import { axios } from '@/plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { localStorageToken } from '@/config'

import * as TypesBase from '@/types/base'
import * as TypesAdmin from '@/types/admin'

const prefix = '/api'
const prefixAdmin = `${prefix}/admin`

const emptyUserinfo = {
  id: '',
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
    signin (postData: TypesAdmin.IAdminSigninType, options?: AxiosRequestConfig): Promise<string> {
      return new Promise((resolve, reject) => {
        axios.post<TypesAdmin.IAdminSigninType, TypesBase.IResponeBodyType<string>>(`${prefix}/signin`, postData, options).then(res => {
          this.token = res.data
          localStorage.setItem(localStorageToken, this.token)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    signout (options?: AxiosRequestConfig): Promise<string> {
      return new Promise((resolve, reject) => {
        axios.get<undefined, TypesBase.IResponeBodyType<string>>(`${prefix}/signout`, options).then(res => {
          this.token = ''
          this.userinfo = emptyUserinfo
          localStorage.setItem(localStorageToken, this.token)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    fetchuserinfo (options?: AxiosRequestConfig): Promise<TypesAdmin.IAdminContextUserType> {
      return new Promise((resolve, reject) => {
        axios.get<undefined, TypesBase.IResponeBodyType<TypesAdmin.IAdminContextUserType>>(`${prefix}/userinfo`, options).then(res => {
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
    changePassword (postData: TypesAdmin.IAdminChangePasswordType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> {
      return axios.post<TypesAdmin.IAdminChangePasswordType, TypesBase.IResponeBodyType<string>>(`${prefix}/password`, postData, options)
    },
    changeAccountInfo (postData: TypesAdmin.IAdminChangeAccountInfoType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> {
      return axios.post<TypesAdmin.IAdminChangeAccountInfoType, TypesBase.IResponeBodyType<string>>(`${prefix}/update`, postData, options)
    },
    adminList (options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesAdmin.IAdminType[]>> {
      return axios.get<undefined, TypesBase.IResponeBodyType<TypesAdmin.IAdminType[]>>(`${prefixAdmin}/list`, options)
    },
    adminCreate (postData: TypesAdmin.IAdminCreateType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesAdmin.IAdminType>> {
      return axios.post<TypesAdmin.IAdminCreateType, TypesBase.IResponeBodyType<TypesAdmin.IAdminType>>(`${prefixAdmin}/create`, postData, options)
    },
    adminResetPassword (id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> {
      return axios.get<undefined, TypesBase.IResponeBodyType<string>>(`${prefixAdmin}/reset/password/${id}`, options)
    },
    adminDisabled (id: string, status: 0 | 1, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> {
      return axios.get<undefined, TypesBase.IResponeBodyType<string>>(`${prefixAdmin}/disabled/${id}/${status}`, options)
    }
  }
})
export default useStore
