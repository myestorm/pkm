import { HydratedDocument, Types } from 'mongoose'
import { IKnowledgeDocType as Doc } from './knowledge'

export interface IRecycleType {
  _id: string,
  title: string,
  children: IKnowledgeDocType[]
}

// mongoose model type
export type ISchemaRecycleType = Omit<IRecycleType, '_id'>
export type IRecycleModelType = HydratedDocument<
  IRecycleType & {
    children: Types.DocumentArray<Doc> & Types.Subdocument
  }
>

export type IKnowledgeDocType = Doc
