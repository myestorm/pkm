import { HydratedDocument, Types } from 'mongoose'
export interface IKnowledgeDocType {
  _id: Types.ObjectId,
  title: string,
  desc: string,
  publishAt: Date,
  thumb: string,
  content: string,
  tags: string[],
  order: number,
  createdAt: Date,
  updatedAt: Date
}

export interface IKnowledgeType {
  _id: Types.ObjectId,
  title: string,
  isDefault: boolean,
  desc: string,
  thumb: string,
  children: IKnowledgeDocType[],
  order: number,
  createdAt: Date,
  updatedAt: Date,
}

// mongoose model type
export type ISchemaDocType = Omit<IKnowledgeDocType, '_id'>
export type ISchemaKnowledgeType = Omit<IKnowledgeType, '_id'>
export type IBookrackModelType = HydratedDocument<
  ISchemaKnowledgeType & {
    children: Types.DocumentArray<IKnowledgeDocType> & Types.Subdocument
  }
>

// controller
export type IControllerKnowledgeAddType = Omit<IKnowledgeType, '_id' | 'children' | 'createdAt' | 'updatedAt'>
export type IControllerKnowledgeDocAddType = Omit<IKnowledgeDocType, '_id' | 'createdAt' | 'updatedAt'>

// store

export type IStoreKnowledgeUpdateType =  IControllerKnowledgeAddType & { _id?: string }
export type IStoreKnowledgeDocAddType =  IControllerKnowledgeAddType & { kid?: string }
export type IStoreKnowledgeDocUpdateType =  IControllerKnowledgeAddType & { kid?: string, _id?: string }
