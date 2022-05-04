import { defineStore } from 'pinia'
import { BookState } from './types'

import { axios } from '@/plugins/axios'
import { AxiosRequestConfig } from 'axios'

import * as TypesBase from '@/types/base'
import * as TypesBook from '@/types/book'

const prefix = '/api/book'

const formDefault: TypesBook.IBookCreateType = {
  title: '',
  directory: [],
  type: TypesBase.IBaseTypesType.FILE,
  cover: '',
  desc: '',
  tags: [],
  author: '',
  readed: false,
  heard: false,
  purchased: false,
  ISBN: '',
  rating: 3
}

const bookDefault: TypesBook.IBookType = {
  ...formDefault,
  id: '',
  directoryList: [],
  top: false,
  order: 99,
  notes: [],
  comments: [],
  createdAt: new Date(),
  createdBy: '',
  updatedAt: new Date(),
  updatedBy: ''
}

const useStore = defineStore('book', {
  state: (): BookState => ({
  }),

  getters: {
    getFormDefault () {
      return {
        ...formDefault
      }
    },
    getBookDefault () {
      return {
        ...bookDefault
      }
    }
  },

  actions: {
    bookList (postData: TypesBook.IBookQueryType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType[]>> {
      return axios.post<TypesBook.IBookQueryType, TypesBase.IResponeBodyType<TypesBook.IBookType[]>>(`${prefix}/list`, postData, options)
    },
    bookCreate (postData: TypesBook.IBookCreateType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType>> {
      return axios.post<TypesBook.IBookCreateType, TypesBase.IResponeBodyType<TypesBook.IBookType>>(`${prefix}/create`, postData, options)
    },
    bookUpdate (id: string, postData: TypesBook.IBookCreateType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType>> {
      return axios.put<TypesBook.IBookCreateType, TypesBase.IResponeBodyType<TypesBook.IBookType>>(`${prefix}/update/${id}`, postData, options)
    },
    bookRemove (id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<boolean>> {
      return axios.delete<undefined, TypesBase.IResponeBodyType<boolean>>(`${prefix}/remove/${id}`, options)
    },
    bookInfo (id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType>> {
      return axios.get<undefined, TypesBase.IResponeBodyType<TypesBook.IBookType>>(`${prefix}/info/${id}`, options)
    },
    bookOrder (id: string, order: number, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<boolean>> {
      return axios.put<{ order: number }, TypesBase.IResponeBodyType<boolean>>(`${prefix}/update/${id}/order`, { order }, options)
    },
    bookMove (postData: { id: string, directory: string[] }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<boolean>> {
      return axios.put<{ id: string, directory: string[] }, TypesBase.IResponeBodyType<boolean>>(`${prefix}/move`, postData, options)
    },
    bookCopy (postData: { id: string, directory: string[] }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<boolean>> {
      return axios.post<{ id: string, directory: string[] }, TypesBase.IResponeBodyType<boolean>>(`${prefix}/copy`, postData, options)
    },
    bookSearch (keyword: string, directory: string[], options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.IBookType[]>> {
      return axios.post<undefined, TypesBase.IResponeBodyType<TypesBook.IBookType[]>>(`${prefix}/search/${keyword}`, { directory }, options)
    },
    noteInfo (bookId: string, id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.INoteType>> {
      return axios.get<undefined, TypesBase.IResponeBodyType<TypesBook.INoteType>>(`${prefix}/note/${bookId}/${id}`, options)
    },
    noteAdd (bookId: string, postData: TypesBook.INoteCreateType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.INoteType>> {
      return axios.post<TypesBook.INoteCreateType, TypesBase.IResponeBodyType<TypesBook.INoteType>>(`${prefix}/note/add/${bookId}`, postData, options)
    },
    noteUpdate (bookId: string, id: string, postData: TypesBook.INoteCreateType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBook.INoteType>> {
      return axios.put<TypesBook.INoteCreateType, TypesBase.IResponeBodyType<TypesBook.INoteType>>(`${prefix}/note/update/${bookId}/${id}`, postData, options)
    },
    noteRemove (bookId: string, id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<boolean>> {
      return axios.delete<undefined, TypesBase.IResponeBodyType<boolean>>(`${prefix}/note/remove/${bookId}/${id}`, options)
    },
    bookTop (id: string, top: boolean, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> {
      return axios.get<undefined, TypesBase.IResponeBodyType<string>>(`${prefix}/top/${id}/${top}`, options)
    }
  }
})
export default useStore
