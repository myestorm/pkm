export interface IKnowledgeDocType {
  _id?: string,
  title: string,
  desc?: string,
  createdAt?: Date,
  updatedAt?: Date,
  publishAt?: Date,
  thumb?: string,
  content?: string,
  tags?: string[],
  order?: number
}

export interface IKnowledgeType {
  _id?: string,
  title: string,
  isDefault?: boolean,
  desc?: string,
  createdAt?: Date,
  updatedAt?: Date,
  thumb?: string,
  children?: IKnowledgeDocType[],
  order?: number
}

export type IKnowledgeUpdateType = Omit<IKnowledgeType, '_id'>
export type IKnowledgeDocUpdateType = Omit<IKnowledgeDocType, '_id'>

