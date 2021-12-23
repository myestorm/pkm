import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType, IResponePageBodyType } from '../../app/types/index'
import { IKnowledgeDocType, IKnowledgeType } from '../../app/types/knowledge'
import { IRecycleType } from '../../app/types/recycle'

const prefix = '/api'

// 获取所有知识库
export const ApiKnowledge = (options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeType[]>> => {
  return axios.get(`${prefix}/knowledge/list`, {
    ...options
  })
}

// 通过id查找知识库信息
export const ApiKnowledgeInfoId = (data: { id: string, hasChildren?: number }, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeType>> => {
  let url = `${prefix}/knowledge/info/${data.id}`
  if (Number(data.hasChildren) === 1) {
    url = `${url}/${data.hasChildren}`
  }
  return axios.get(url, {
    ...options
  })
}

// 通过id查询所有文档
export const ApiKnowledgeDocumentId = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeDocType[]>> => {
  return axios.get(`${prefix}/knowledge/document/${id}`, {
    ...options
  })
}

// 设置默认知识库
export const ApiKnowledgeSetDefaultId = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.get(`${prefix}/knowledge/set_default/${id}`, {
    ...options
  })
}

// 添加知识库
export const ApiKnowledgeAdd = (postData: IKnowledgeType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.post(`${prefix}/knowledge/add`, postData, {
    ...options
  })
}

// 修改知识库
export const ApiKnowledgeUpdate = (postData: IKnowledgeType, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const id = postData._id
  delete postData._id
  return axios.put(`${prefix}/knowledge/update/${id}`, postData, {
    ...options
  })
}

// 删除知识库
export const ApiKnowledgeRemove = (id: string, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/knowledge/remove/${id}`, {
    ...options
  })
}

// 知识库排序
export const ApiKnowledgeOrder = (data: { id: string, order: number }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.put(`${prefix}/knowledge/order/${data.id}/${data.order}`, {}, {
    ...options
  })
}

// 修改文档
export const ApiDocumentUpdate = (postData: IKnowledgeDocType & { kid?: string }, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeDocType>> => {
  const id = postData.kid
  const did = postData._id
  delete postData._id
  delete postData.kid
  return axios.put(`${prefix}/document/update/${id}/${did}`, postData, {
    ...options
  })
}

// 添加文档
export const ApiDocumentAdd = (postData: IKnowledgeDocType & { kid?: string }, options?: AxiosRequestConfig): Promise<IResponeBodyType<IKnowledgeDocType>> => {
  const id = postData.kid
  delete postData.kid
  return axios.post(`${prefix}/document/add/${id}`, postData, {
    ...options
  })
}

// 删除文档
export const ApiDocumentRemove = (data: { kid: string, id: string }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/document/remove/${data.kid}/${data.id}`, {
    ...options
  })
}

// 文档排序
export const ApiDocumentOrder = (data: { id: string, did: string, order: number }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.put(`${prefix}/document/order/${data.id}/${data.did}/${data.order}`, {}, {
    ...options
  })
}

// 文档转移
export const ApiDocumentTransfer = (postData: { fid: string, tid: string, id: string }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  const { fid, tid, id } = postData
  return axios.put(`${prefix}/document/transfer/${fid}/${tid}/${id}`, {
    ...options
  })
}

// 获取所有回收站内容
export const ApiRecycle = (options?: AxiosRequestConfig): Promise<IResponeBodyType<IRecycleType[]>> => {
  return axios.get(`${prefix}/recycle/list`, {
    ...options
  })
}

// 清空回收站
export const ApiRecycleRemoveAll = (options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/recycle/remove_all`, {
    ...options
  })
}

// 删除回收站中一条数据
export const ApiRecycleRemove = (data: { kid: string, id: string }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/recycle/remove/${data.kid}/${data.id}`, {
    ...options
  })
}

