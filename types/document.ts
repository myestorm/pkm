import { HydratedDocument, Types } from 'mongoose'
import { ICommentType } from './comment'

export enum IDocumentTypeType {
  DOC = 'document',
  FOLDER = 'folder'
}

export interface IDocumentType<T> {
  _id: T,
  title: string, // 标题
  type: IDocumentTypeType, // 类型 文件夹或文件
  authorId: string, // 创建人
  cover: string, // 封面
  desc: string, // 简介说明
  content: string, // 正文
  tags: string[], // 标签
  top: boolean, // 置顶
  parents: string[], // 所属目录
  comments: ICommentType<T>[]
  createdAt: Date, // 创建时间
  createdBy: string, // 创建人
  updatedAt: Date, // 创建时间
  updatedBy: string // 修改人
}

export type ISchemaDocumentType = Omit<IDocumentType<Types.ObjectId>, '_id'>
export type IDocumentModelType = HydratedDocument<
  ISchemaDocumentType & {
    comments: Types.DocumentArray<
      ICommentType<Types.ObjectId>
    > & Types.Subdocument
  }
>

export type IDocumentDataType = IDocumentType<Types.ObjectId>
export type IDocumentAddType = Omit<IDocumentType<string>, '_id' | 'createdAt' | 'updatedAt' | 'comments' | 'createdBy' | 'updatedBy'>
export type IDocumentUpdateType = IDocumentAddType & { _id: string }
export type IDocumentFilterType = Partial<IDocumentType<string>>

export type IDocumentFormType = IDocumentAddType & { _id?: string }
export type IDocumentPageListItemType = IDocumentType<string>
export type IDocumentSearchType = Pick<IDocumentType<string>, '_id' | 'title' | 'parents' | 'type' | 'desc' | 'top'>

// route
export type IDocumentRouteAddType = Omit<IDocumentType<string>, '_id' | 'createdAt' | 'updatedAt' | 'comments'>
export type IDocumentRouteUpdateType = IDocumentRouteAddType & { _id: string }
