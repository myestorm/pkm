import { IKnowledgeDocType as Doc } from './knowledge'
export interface IRecycleType {
  _id?: string,
  title: string,
  children?: IKnowledgeDocType[]
}

export type IRecycleUpdateType = Omit<IRecycleType, '_id'>

export type IKnowledgeDocType = Doc
