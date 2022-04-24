import { Types } from 'mongoose'

export enum IBaseTypesType {
  FILE = 'file',
  FOLDER = 'folder'
}
export interface IBaseFieldsType<T> {
  _id: T,
  title: string, // 标题
  directory: string[], // 所属目录
  type: IBaseTypesType, // 资源类型
  cover: string, // 封面
  desc: string, // 简介
  tags: string[], // 标签
  top: boolean, // 置顶
  order: number, // 排序 越小越靠前
  createdAt: Date, // 创建时间
  createdBy: string, // 创建人
  updatedAt: Date, // 创建时间
  updatedBy: string // 修改人
}

export type IBaseFieldsStringIdType = IBaseFieldsType<string>
export type IBaseFieldsObjectIdType = IBaseFieldsType<Types.ObjectId>
