import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import * as TypesBase from '@/types/base'
import * as TypesDocument from '@/types/document'

const prefix = '/api/document'

// _id为空时添加文档，有_id时修改文档
export const DocumentForm = (postData: TypesDocument.IDocumentFileFormType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.post(`${prefix}/add`, postData, {
    ...options
  })
}

// 获取所有文档
export const DocumentList = (postData: TypesDocument.IDocumentListType, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesDocument.IDocumentType[]>> => {
  return axios.post(`${prefix}/list`, postData, {
    ...options
  })
}

// 搜索文档
export const DocumentSearch = (keyword: string, directory?: string[], options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesDocument.IDocumentType[]>> => {
  return axios.post(`${prefix}/search/${keyword}`, { directory }, {
    ...options
  })
}

// 修改目录
export const DocumentMove = (postData: { id: string, directory: string[] }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.put(`${prefix}/move`, postData, {
    ...options
  })
}

// 复制
export const DocumentCopy = (postData: { id: string, directory: string[] }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.post(`${prefix}/copy`, postData, {
    ...options
  })
}

// 修改排序
export const DocumentUpdateOrder = (postData: { id: string, order: number }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.put(`${prefix}/update/order`, postData, {
    ...options
  })
}

// 修改正文
export const DocumentUpdateContent = (postData: { id: string, content: string }, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.put(`${prefix}/update/content`, postData, {
    ...options
  })
}

// 删除文档
export const DocumentRemove = (id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/remove/${id}`, {
    ...options
  })
}

// 文档信息
export const DocumentInfo = (id: string, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesDocument.IDocumentType | null>> => {
  return axios.get(`${prefix}/info/${id}`, {
    ...options
  })
}

// 面包屑查询
export const DocumentBreadcrumbs = (ids: string[], options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBase.IBreadcrumbType[]>> => {
  return axios.post(`${prefix}/breadcrumbs`, { ids }, {
    ...options
  })
}

// 获取所有文档分页
export const DocumentListPage = (postData: TypesBase.IPageType<TypesDocument.IDocumentListType>, options?: AxiosRequestConfig): Promise<TypesBase.IResponeBodyType<TypesBase.IResponePageBodyType<TypesDocument.IDocumentType>>> => {
  return axios.post(`${prefix}/list/page`, postData, {
    ...options
  })
}
