import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import * as TypesBase from '../types/base'
import * as TypesAdmin from '../types/admin'

const prefix = '/admin'

// 获取用户信息
export const AdminInfo = (options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesAdmin.IUserInfoType>> => {
  return axios.get(`${prefix}/info`, {
    ...options
  })
}

// 登录
export const AdminSignin = (postData: TypesAdmin.ISigninType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.post(`${prefix}/signin`, postData, {
    ...options
  })
}

// 登出
export const AdminSignout = (options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.get(`${prefix}/signout`, {
    ...options
  })
}

// 列表
export const AdminList = (options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesAdmin.IAdminType[]>> => {
  return axios.get(`${prefix}/list`, {
    ...options
  })
}

// 添加
export const AdminAdd = (postData: TypesAdmin.IAdminAddType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.post(`${prefix}/add`, postData, {
    ...options
  })
}

// 重置密码
export const AdminResetPassword = (id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.get(`${prefix}/reset/password/${id}`, {
    ...options
  })
}

// 启用禁用
export const AdminDisabled = (id: string, status: number, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.get(`${prefix}/disabled/${id}/${status}`, {
    ...options
  })
}

// 修改密码
export const AdminUpdateSelfPassword = (postData: TypesAdmin.IAdminUpdateSelfPasswordType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.post(`${prefix}/self/password`, postData, {
    ...options
  })
}

// 修改信息
export const AdminUpdateSelfInfo = (postData: TypesAdmin.IAdminUpdateSelfInfoType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.post(`${prefix}/self/info`, postData, {
    ...options
  })
}
