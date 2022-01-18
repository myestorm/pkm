import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType } from '../../types/index'
import { 
  IBookrackGroupType,
  IBookType,
  IApisBookrackGroupAddType,
  IApisBookrackGroupUpdateType,
  IApisBookAddType,
  IApisBookUpdateType,
  IApisBookRemoveType,
  IApisNoteAddType,
  IApisNoteUpdateType,
  IApisNoteRemoveType
} from '../../types/bookrack'

const prefix = '/api/bookrack'

// 获取所有分类
export const BookrackList = (options?: AxiosRequestConfig): Promise<IResponeBodyType<IBookrackGroupType[]>> => {
  return axios.get(`${prefix}/list`, {
    ...options
  })
}

// 新增分组
export const BookrackAdd = (postData: IApisBookrackGroupAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.post(`${prefix}/add`, postData, {
    ...options
  })
}

// 编辑分组
export const BookrackUpdate = (postData: IApisBookrackGroupUpdateType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const id = postData._id
  delete postData._id
  return axios.put(`${prefix}/update/${id}`, postData, {
    ...options
  })
}


// 删除分组
export const BookrackRemove = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/remove/${id}`, {
    ...options
  })
}

// 查找分类下所有书本
export const BookList = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<IBookType[]>> => {
  return axios.get(`${prefix}/book/${id}`, {
    ...options
  })
}

// 添加书本
export const BookAdd = (postData: IApisBookAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const groupId = postData.groupId
  delete postData.groupId
  return axios.post(`${prefix}/book/add/${groupId}`, postData, {
    ...options
  })
}

// 编辑书本
export const BookUpdate = (postData: IApisBookUpdateType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const id = postData._id
  const groupId = postData.groupId
  delete postData.groupId
  delete postData._id
  return axios.put(`${prefix}/book/update/${groupId}/${id}`, postData, {
    ...options
  })
}

// 删除书本
export const BookRemove = (data: IApisBookRemoveType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/book/remove/${data.groupId}/${data.id}`, {
    ...options
  })
}

// 书本信息
export const BookInfo = (data: IApisBookRemoveType, options?: AxiosRequestConfig): Promise<IResponeBodyType<IBookType | null>> => {
  return axios.get(`${prefix}/book/info/${data.groupId}/${data.id}`, {
    ...options
  })
}

// 添加笔记
export const NoteAdd = (postData: IApisNoteAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const groupId = postData.groupId
  const bookId = postData.bookId
  delete postData.groupId
  delete postData.bookId
  return axios.post(`${prefix}/note/add/${groupId}/${bookId}`, postData, {
    ...options
  })
}

// 编辑笔记
export const NoteUpdate = (postData: IApisNoteUpdateType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const id = postData._id
  const groupId = postData.groupId
  const bookId = postData.bookId
  delete postData.groupId
  delete postData.bookId
  delete postData._id
  return axios.put(`${prefix}/note/update/${groupId}/${bookId}/${id}`, postData, {
    ...options
  })
}

// 删除笔记
export const NoteRemove = (data: IApisNoteRemoveType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/note/remove/${data.groupId}/${data.bookId}/${data.id}`, {
    ...options
  })
}
