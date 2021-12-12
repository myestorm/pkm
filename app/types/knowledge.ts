export interface IKnowledgeDocType {
  _id?: string,
  title: string,
  desc?: string,
  createdAt?: Date,
  updatedAt?: Date,
  publishAt?: Date,
  thumb?: string,
  content?: string,
  tags?: string[]
}

export interface IKnowledgeType {
  _id?: string,
  title: string,
  isDefault?: boolean,
  desc?: string,
  createdAt?: Date,
  updatedAt?: Date,
  thumb?: string,
  children?: IKnowledgeDocType[]
}

export type IKnowledgeUpdateType = Omit<IKnowledgeType, '_id'>
export type IKnowledgeDocUpdateType = Omit<IKnowledgeDocType, '_id'>

