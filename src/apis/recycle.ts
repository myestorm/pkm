import { axios } from '../plugins/axios'
import { AxiosRequestConfig } from 'axios'

import { IResponeBodyType } from '../../types/index'
import { IRecycleType } from '../../types/recycle'

const prefix = '/api/recycle'

// 获取所有回收站内容
export const RecycleList = (options?: AxiosRequestConfig): Promise<IResponeBodyType<IRecycleType[]>> => {
  return axios.get(`${prefix}/list`, {
    ...options
  })
}

// 清空回收站
export const RecycleRemoveAll = (options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/remove_all`, {
    ...options
  })
}

// 删除回收站中一条数据
export const RecycleRemove = (data: { kid: string, id: string }, options?: AxiosRequestConfig): Promise<IResponeBodyType<string>> => {
  return axios.delete(`${prefix}/remove/${data.kid}/${data.id}`, {
    ...options
  })
}