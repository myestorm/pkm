import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType, IResponePageBodyType, IPageType } from '../../types/index'
import * as TypesBook from '../../types/book'

const prefix = '/api/book'

// 添加书籍
export const BookAdd = (postData: TypesBook.IBookAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesBook.IBookDataApiType[]>> => {
  return axios.post(`${prefix}/add`, postData, {
    ...options
  })
}

// 修改书籍
export const BookUpdate = (postData: TypesBook.IBookUpdateType, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesBook.IBookDataApiType>> => {
  return axios.put(`${prefix}/update`, postData, {
    ...options
  })
}

// 删除书籍
export const BookRemove = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/remove/${id}`, {
    ...options
  })
}

// 文档书籍
export const BookInfo = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesBook.IBookDataApiType | null>> => {
  return axios.get(`${prefix}/info/${id}`, {
    ...options
  })
}

// 获取所有书籍
export const BookList = (options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesBook.IBookDataApiType[]>> => {
  return axios.post(`${prefix}/list`, {}, {
    ...options
  })
}

// 获取书籍分页
export const BookListPage = (postData: IPageType<{}>, options?: AxiosRequestConfig): Promise<IResponeBodyType<IResponePageBodyType<TypesBook.IBookDataApiType>>> => {
  return axios.post(`${prefix}/list/page`, postData, {
    ...options
  })
}

// 搜索书籍
export const BookSearch = (keyword: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesBook.IBookDataApiType[]>> => {
  return axios.post(`${prefix}/search/${keyword}`, {}, {
    ...options
  })
}

// 添加笔记
export const NoteAdd = (bookId: string, postData: TypesBook.INoteApiAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesBook.INoteApiReurnType[]>> => {
  return axios.post(`${prefix}/note/add/${bookId}`, postData, {
    ...options
  })
}

// 修改笔记
export const NoteUpdate = (bookId: string, noteId: string, postData: TypesBook.INoteApiAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesBook.INoteApiReurnType>> => {
  return axios.put(`${prefix}/note/update/${bookId}/${noteId}`, postData, {
    ...options
  })
}

// 删除笔记
export const NoteRemove = (bookId: string, noteId: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/note/remove/${bookId}/${noteId}`, {
    ...options
  })
}

// 查询笔记
export const NoteInfo = (bookId: string, noteId: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesBook.INoteApiReurnType | null>> => {
  return axios.delete(`${prefix}/note/info/${bookId}/${noteId}`, {
    ...options
  })
}

