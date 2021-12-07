export interface IKnowledgeDocType {
  title: string,
  desc: string,
  createdAt: Date,
  thumb?: string,
  content?: string
}

export interface IKnowledgeType {
  _id?: string,
  title: string,
  desc?: string,
  createdAt?: Date,
  thumb?: string,
  children?: IKnowledgeDocType[]
}
