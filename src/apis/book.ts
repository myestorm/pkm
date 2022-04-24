import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import * as TypesBase from '../types/base'
import * as TypesBook from '../types/book'

const prefix = '/api/book'

// 获取所有书籍
export const BookList = (postData: TypesBook.IBookQueryType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType[]>> => {
  return axios.post(`${prefix}/list`, postData, {
    ...options
  })
}

// 删除书籍
export const BookRemove = (id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/remove/${id}`, {
    ...options
  })
}

// 搜索书籍
export const BookSearch = (postData: TypesBase.ISearchParamsType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType[]>> => {
  return axios.post(`${prefix}/search`, postData, {
    ...options
  })
}

// 查找文档面包屑的名称
export const BookBreadcrumbs = (postData: { ids: string[] }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType[]>> => {
  return axios.post(`${prefix}/breadcrumbs`, postData, {
    ...options
  })
}

// 复制
export const BookCopy = (postData: { id: string, directory: string[] }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType[]>> => {
  return axios.post(`${prefix}/copy`, postData, {
    ...options
  })
}

// 移动
export const BookMove = (postData: { id: string, directory: string[] }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType[]>> => {
  return axios.put(`${prefix}/move`, postData, {
    ...options
  })
}

// 排序
export const BookOrder = (postData: { id: string, order: number }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType[]>> => {
  return axios.put(`${prefix}/order`, postData, {
    ...options
  })
}

// 添加书籍
export const BookAdd = (postData: TypesBook.IBookFormType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType[]>> => {
  return axios.post(`${prefix}/add`, postData, {
    ...options
  })
}

// 修改书籍
export const BookUpdate = (postData: TypesBook.IBookAddType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType>> => {
  return axios.put(`${prefix}/update`, postData, {
    ...options
  })
}



// 文档书籍
export const BookInfo = (id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType | null>> => {
  return axios.get(`${prefix}/info/${id}`, {
    ...options
  })
}

// 获取书籍分页
export const BookListPage = (postData: TypesBase.IPageType<{}>, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBase.IResponePageBodyType<TypesBook.IBookType>>> => {
  return axios.post(`${prefix}/list/page`, postData, {
    ...options
  })
}

// 添加笔记
export const NoteAdd = (bookId: string, postData: TypesBook.INoteAddType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.INoteType[]>> => {
  return axios.post(`${prefix}/note/add/${bookId}`, postData, {
    ...options
  })
}

// 修改笔记
export const NoteUpdate = (bookId: string, noteId: string, postData: TypesBook.INoteAddType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.INoteType>> => {
  return axios.put(`${prefix}/note/update/${bookId}/${noteId}`, postData, {
    ...options
  })
}

// 删除笔记
export const NoteRemove = (bookId: string, noteId: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/note/remove/${bookId}/${noteId}`, {
    ...options
  })
}

// 查询笔记
export const NoteInfo = (bookId: string, noteId: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.INoteType | null>> => {
  return axios.delete(`${prefix}/note/info/${bookId}/${noteId}`, {
    ...options
  })
}

