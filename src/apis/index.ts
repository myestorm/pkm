import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType, IResponePageBodyType } from '../../app/types/index'
import { IDocumentListItemType, IDocumentListQueryType, IDocumentType } from '../../app/types/document'
import { IKnowledgeDocType, IKnowledgeType } from '../../app/types/knowledge'

const prefix = '/api'

// 获取所有知识库
export const ApiKnowledge = (options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeType[]>> => {
  return axios.get(`${prefix}/knowledge/list`, {
    ...options
  })
}

// 添加知识库
export const ApiKnowledgeAdd = (postData: IKnowledgeType, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeType>> => {
  return axios.post(`${prefix}/knowledge/add`, postData, {
    ...options
  })
}

// 修改知识库
export const ApiKnowledgeUpdate = (postData: IKnowledgeType, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeType>> => {
  const id = postData._id
  delete postData._id
  return axios.put(`${prefix}/knowledge/update/${id}`, postData, {
    ...options
  })
}

// 删除知识库
export const ApiKnowledgeRemove = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeType>> => {
  return axios.delete(`${prefix}/knowledge/remove/${id}`, {
    ...options
  })
}

// 通过id查找知识库信息
export const ApiKnowledgeInfoId = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeType>> => {
  return axios.get(`${prefix}/knowledge/info/${id}`, {
    ...options
  })
}

// 获取文档详细信息
export const ApiDocumentId = (id: number, options?: AxiosRequestConfig): Promise<IResponeBodyType<IDocumentType>> => {
  return axios.get(`/api/document/${id}`, options)
}
