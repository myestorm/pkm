import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType } from '../../app/types/index'
import { IBookrackGroupType, IBookrackType } from '../../types/bookrack'

const prefix = '/bookrack'

// 获取所有分类
export const BookrackList = (options?: AxiosRequestConfig): Promise<IResponeBodyType<IBookrackGroupType[]>> => {
  return axios.get(`${prefix}/list`, {
    ...options
  })
}

// 新增分组
export type IBookrackGroupAddType = Pick<IBookrackGroupType, 'title' | 'desc'>
export const BookrackAdd = (postData: IBookrackGroupAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.post(`${prefix}/add`, postData, {
    ...options
  })
}

// 编辑分组
export type IBookrackGroupUpdateType = Pick<IBookrackGroupType, 'title' | 'desc'> & {
  _id?: string
}
export const BookrackUpdate = (postData: IBookrackGroupUpdateType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const id = postData._id
  delete postData._id
  return axios.put(`${prefix}/update/${id}`, postData, {
    ...options
  })
}


// 删除分组
export const BookrackDelete = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/remove/${id}`, {
    ...options
  })
}

// 查找分类下所有书本
export const BookList = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<IBookrackType[]>> => {
  return axios.get(`${prefix}/book/${id}`, {
    ...options
  })
}

// 添加书本
export type IBookrackBookAddType = Omit<IBookrackType, '_id' | 'createdAt' | 'updatedAt'> & {
  groupId: string
}
export const BookAdd = (postData: IBookrackBookAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const groupId = postData.groupId
  return axios.post(`${prefix}/book/${groupId}`, postData, {
    ...options
  })
}
