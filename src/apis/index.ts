import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType, IResponePageBodyType } from '../../app/types/index'
import { IDocumentListItemType, IDocumentListQueryType, IDocumentType } from '../../app/types/document'

// 获取所有文档列表分页
export const ApiDocuments = (data: IDocumentListQueryType, options?: AxiosRequestConfig): Promise<IResponeBodyType<IResponePageBodyType<IDocumentListItemType>>> => {
  return axios.get('/api/documents', {
    params: data,
    ...options
  })
}

// 获取文档详细信息
export const ApiDocumentId = (id: number, options?: AxiosRequestConfig): Promise<IResponeBodyType<IDocumentType>> => {
  return axios.get(`/api/document/${id}`, options)
}
