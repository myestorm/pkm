import { HydratedDocument, Types } from 'mongoose'
import { IKnowledgeDocType as Doc } from './knowledge'

export interface IRecycleType<T> {
  _id: T,
  title: string,
  children: IKnowledgeDocType[]
}

export type IRecycleMongoType = IRecycleType<Types.ObjectId>

// mongoose model type
export type ISchemaRecycleType = Omit<IRecycleType<Types.ObjectId>, '_id'>
export type IRecycleModelType = HydratedDocument<
  IRecycleType<Types.ObjectId> & {
    children: Types.DocumentArray<Doc<Types.ObjectId>> & Types.Subdocument
  }
>

export type IKnowledgeDocType = Doc<Types.ObjectId>
