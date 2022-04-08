import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType } from '../../types/index'
import { IDocumentAddType, IDocumentUpdateType, IDocumentFilterType, IDocumentPageListItemType, IDocumentSearchType } from '../../types/document'

const prefix = '/api/document'

// 添加文档
export const DocumentAdd = (postData: IDocumentAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<IDocumentUpdateType[]>> => {
  return axios.post(`${prefix}/add`, postData, {
    ...options
  })
}

// 修改文档
export const DocumentUpdate = (postData: IDocumentUpdateType, options?: AxiosRequestConfig): Promise<IResponeBodyType<IDocumentUpdateType[]>> => {
  return axios.put(`${prefix}/update`, postData, {
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
export const DocumentInfo = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<IDocumentUpdateType | null>> => {
  return axios.get(`${prefix}/info/${id}`, {
    ...options
  })
}

// 获取所有文档
export const DocumentList = (postData: IDocumentFilterType, options?: AxiosRequestConfig): Promise<IResponeBodyType<IDocumentPageListItemType[]>> => {
  return axios.post(`${prefix}/list`, postData, {
    ...options
  })
}

// 搜索文档
export const DocumentSearch = (keyword: string, parents?: string[], options?: AxiosRequestConfig): Promise<IResponeBodyType<IDocumentSearchType[]>> => {
  return axios.post(`${prefix}/search/${keyword}`, { parents }, {
    ...options
  })
}
