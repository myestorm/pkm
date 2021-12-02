export interface IDocumentListItemType {
  id: number,
  title: string,
  desc: string,
  createdAt: Date,
  thumb?: string
}

export interface IDocumentType extends IDocumentListItemType {
  content: string
}

export interface IDocumentListQueryType {
  page: number,
  pagesize: number,
  keyword?: string
}
