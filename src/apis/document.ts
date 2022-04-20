import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType, IResponePageBodyType, IPageType } from '../../types/index'
import * as TypesDocumnet from '../../types/document'

const prefix = '/api/document'

// 添加文档
export const DocumentAdd = (postData: TypesDocumnet.IDocumentAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesDocumnet.IDocumentUpdateType[]>> => {
  return axios.post(`${prefix}/add`, postData, {
    ...options
  })
}

// 修改文档
export const DocumentUpdate = (postData: TypesDocumnet.IDocumentUpdateType, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesDocumnet.IDocumentUpdateType[]>> => {
  return axios.put(`${prefix}/update`, postData, {
    ...options
  })
}

// 修改目录
export const DocumentUpdateParents = (postData: { id: string, parents: string[] }, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesDocumnet.IDocumentUpdateType[]>> => {
  return axios.put(`${prefix}/update/parents`, postData, {
    ...options
  })
}

// 删除文档
export const DocumentRemove = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/remove/${id}`, {
    ...options
  })
}

// 文档信息
export const DocumentInfo = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesDocumnet.IDocumentUpdateType | null>> => {
  return axios.get(`${prefix}/info/${id}`, {
    ...options
  })
}

// 获取所有文档
export const DocumentList = (postData: TypesDocumnet.IDocumentFilterType, options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesDocumnet.IDocumentPageListItemType[]>> => {
  return axios.post(`${prefix}/list`, postData, {
    ...options
  })
}

// 获取所有文档分页
export const DocumentListPage = (postData: IPageType<TypesDocumnet.IDocumentFilterType>, options?: AxiosRequestConfig): Promise<IResponeBodyType<IResponePageBodyType<TypesDocumnet.IDocumentPageListItemType>>> => {
  return axios.post(`${prefix}/list/page`, postData, {
    ...options
  })
}

// 搜索文档
export const DocumentSearch = (keyword: string, parents?: string[], options?: AxiosRequestConfig): Promise<IResponeBodyType<TypesDocumnet.IDocumentPageListItemType[]>> => {
  return axios.post(`${prefix}/search/${keyword}`, { parents }, {
    ...options
  })
}
