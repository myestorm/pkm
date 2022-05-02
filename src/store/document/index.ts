import { defineStore } from 'pinia'
import { DocumentState } from './types'

import { axios } from '@/plugins/axios'
import { AxiosRequestConfig } from 'axios'

import * as TypesBase from '@/types/base'
import * as TypesDocument from '@/types/document'

const prefix = '/api/document'

const formDefault: TypesDocument.IDocumentCreateType = {
  title: '',
  directory: [],
  type: TypesBase.IBaseTypesType.FILE,
  cover: '',
  desc: '',
  tags: []
}

const documentDefault: TypesDocument.IDocumentType = {
  id: '',
  title: '',
  directory: [],
  directoryList: [],
  type: TypesBase.IBaseTypesType.FILE,
  cover: '',
  desc: '',
  tags: [],
  top: false,
  order: 99,
  content: '',
  comments: [],
  createdAt: new Date(),
  createdBy: '',
  updatedAt: new Date(),
  updatedBy: ''
}

const useStore = defineStore('document', {
  state: (): DocumentState => ({
  }),

  getters: {
    getFormDefault () {
      return {
        ...formDefault
      }
    },
    getDocumentDefault () {
      return {
        ...documentDefault
      }
    }
  },

  actions: {
    documentList (postData: TypesDocument.IDocumentQueryType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesDocument.IDocumentType[]>> {
      return axios.post<TypesDocument.IDocumentQueryType, TypesBase.IResponeBodyType<TypesDocument.IDocumentType[]>>(`${prefix}/list`, postData, options)
    },
    documentCreate (postData: TypesDocument.IDocumentCreateType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesDocument.IDocumentType>> {
      return axios.post<TypesDocument.IDocumentCreateType, TypesBase.IResponeBodyType<TypesDocument.IDocumentType>>(`${prefix}/create`, postData, options)
    },
    documentUpdate (id: string, postData: TypesDocument.IDocumentCreateType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesDocument.IDocumentType>> {
      return axios.put<TypesDocument.IDocumentCreateType, TypesBase.IResponeBodyType<TypesDocument.IDocumentType>>(`${prefix}/update/${id}`, postData, options)
    },
    documentUpdateContent (id: string, content: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> {
      return axios.put<TypesDocument.IDocumentCreateType, TypesBase.IResponeBodyType<string>>(`${prefix}/update/${id}/content`, { content }, options)
    },
    documentRemove (id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<boolean>> {
      return axios.delete<undefined, TypesBase.IResponeBodyType<boolean>>(`${prefix}/remove/${id}`, options)
    },
    documentInfo (id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesDocument.IDocumentType>> {
      return axios.get<undefined, TypesBase.IResponeBodyType<TypesDocument.IDocumentType>>(`${prefix}/info/${id}`, options)
    },
    documentOrder (id: string, order: number, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<boolean>> {
      return axios.put<{ order: number }, TypesBase.IResponeBodyType<boolean>>(`${prefix}/update/${id}/order`, { order }, options)
    },
    documentMove (postData: { id: string, directory: string[] }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<boolean>> {
      return axios.put<{ id: string, directory: string[] }, TypesBase.IResponeBodyType<boolean>>(`${prefix}/move`, postData, options)
    },
    documentCopy (postData: { id: string, directory: string[] }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<boolean>> {
      return axios.post<{ id: string, directory: string[] }, TypesBase.IResponeBodyType<boolean>>(`${prefix}/copy`, postData, options)
    },
    documentSearch (keyword: string, directory: string[], options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesDocument.IDocumentType[]>> {
      return axios.post<undefined, TypesBase.IResponeBodyType<TypesDocument.IDocumentType[]>>(`${prefix}/search/${keyword}`, { directory }, options)
    },
  }
})
export default useStore
