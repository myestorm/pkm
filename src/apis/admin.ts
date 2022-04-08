import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType } from '../../types/index'
import { IUserInfoType, ISigninType } from '../../types/admin'

const prefix = '/admin'

// 获取用户信息
export const AdminInfo = (options?: AxiosRequestConfig): Promise<IResponeBodyType<IUserInfoType>> => {
  return axios.get(`${prefix}/info`, {
    ...options
  })
}

// 登录
export const AdminSignin = (postData: ISigninType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.post(`${prefix}/signin`, postData, {
    ...options
  })
}

// 登出
export const AdminSignout = (options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.get(`${prefix}/signout`, {
    ...options
  })
}

