import { HydratedDocument, Types } from 'mongoose'
export interface IKnowledgeDocType<T> {
  _id: T,
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

export interface IKnowledgeType<T> {
  _id: T,
  title: string,
  isDefault: boolean,
  desc: string,
  thumb: string,
  children: IKnowledgeDocType<T>[],
  order: number,
  createdAt: Date,
  updatedAt: Date,
}

export type IKnowledgeMongoType = IKnowledgeType<Types.ObjectId>
export type IKnowledgeDocMongoType = IKnowledgeDocType<Types.ObjectId>

// mongoose model type
export type ISchemaDocType = Omit<IKnowledgeDocMongoType, '_id'>
export type ISchemaKnowledgeType = Omit<IKnowledgeMongoType, '_id'>
export type IBookrackModelType = HydratedDocument<
  ISchemaKnowledgeType & {
    children: Types.DocumentArray<IKnowledgeMongoType> & Types.Subdocument
  }
>

// controller
export type IControllerKnowledgeAddType = Omit<IKnowledgeType<string>, '_id' | 'children' | 'createdAt' | 'updatedAt'>
export type IControllerKnowledgeDocAddType = Omit<IKnowledgeDocType<string>, '_id' | 'createdAt' | 'updatedAt'>

// store

export type IStoreKnowledgeUpdateType =  IControllerKnowledgeAddType & { _id?: string }
export type IStoreKnowledgeDocAddType =  IControllerKnowledgeDocAddType & { kid?: string }
export type IStoreKnowledgeDocUpdateType =  IControllerKnowledgeDocAddType & { kid?: string, _id?: string }
