import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType } from '../../types/index'
import {
  IKnowledgeDocType,
  IKnowledgeType,
  IControllerKnowledgeAddType,
  IStoreKnowledgeDocAddType,
  IStoreKnowledgeDocUpdateType
} from '../../types/knowledge'

const prefix = '/api/knowledge'

// 获取所有知识库
export const KnowledgeList = (options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeType<string>[]>> => {
  return axios.get(`${prefix}/list`, {
    ...options
  })
}

// 通过id查找知识库信息
export const KnowledgeInfoId = (data: { id: string, hasChildren?: number }, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeType<string>>> => {
  let url = `${prefix}/info/${data.id}`
  if (Number(data.hasChildren) === 1) {
    url = `${url}/${data.hasChildren}`
  }
  return axios.get(url, {
    ...options
  })
}

// 通过id查询所有文档
export const KnowledgeDocumentId = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeDocType<string>[]>> => {
  return axios.get(`${prefix}/document/${id}`, {
    ...options
  })
}

// 设置默认知识库
export const KnowledgeSetDefaultId = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.get(`${prefix}/set_default/${id}`, {
    ...options
  })
}

// 添加知识库
export const KnowledgeAdd = (postData: IControllerKnowledgeAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.post(`${prefix}/add`, postData, {
    ...options
  })
}

// 修改知识库
export const KnowledgeUpdate = (postData: IControllerKnowledgeAddType & { _id?: string }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const id = postData._id
  delete postData._id
  return axios.put(`${prefix}/update/${id}`, postData, {
    ...options
  })
}

// 删除知识库
export const KnowledgeRemove = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/remove/${id}`, {
    ...options
  })
}

// 知识库排序
export const KnowledgeOrder = (data: { id: string, order: number }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.put(`${prefix}/order/${data.id}/${data.order}`, {}, {
    ...options
  })
}

// 修改文档
export const DocumentUpdate = (postData: IStoreKnowledgeDocUpdateType, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeDocType<string>>> => {
  const id = postData.kid
  const did = postData._id
  delete postData._id
  delete postData.kid
  return axios.put(`${prefix}/document/update/${id}/${did}`, postData, {
    ...options
  })
}

// 添加文档
export const DocumentAdd = (postData: IStoreKnowledgeDocAddType, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeDocType<string>>> => {
  const id = postData.kid
  delete postData.kid
  return axios.post(`${prefix}/document/add/${id}`, postData, {
    ...options
  })
}

// 删除文档
export const DocumentRemove = (data: { kid: string, id: string }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/document/remove/${data.kid}/${data.id}`, {
    ...options
  })
}

// 文档排序
export const DocumentOrder = (data: { id: string, did: string, order: number }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.put(`${prefix}/document/order/${data.id}/${data.did}/${data.order}`, {}, {
    ...options
  })
}

// 文档转移
export const DocumentTransfer = (postData: { fid: string, tid: string, id: string }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const { fid, tid, id } = postData
  return axios.put(`${prefix}/document/transfer/${fid}/${tid}/${id}`, {
    ...options
  })
}
