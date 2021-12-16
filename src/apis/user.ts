import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType } from '../../app/types/index'
import { IUserInfoType, ISigninType } from '../../app/types/admin'

const prefix = '/user'

// 获取用户信息
export const UserInfo = (options?: AxiosRequestConfig): Promise<IResponeBodyType<IUserInfoType>> => {
  return axios.get(`${prefix}/info`, {
    ...options
  })
}

// 登录
export const UserSignin = (postData: ISigninType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.post(`${prefix}/signin`, postData, {
    ...options
  })
}

// 登出
export const UserSignout = (options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.get(`${prefix}/signout`, {
    ...options
  })
}

