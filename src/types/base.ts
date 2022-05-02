export enum IBaseTypesType {
  FILE = 'file',
  FOLDER = 'folder'
}

export interface IBaseFieldsType {
  id: string,
  title: string, // 标题
  directory: string[], // 所属目录
  directoryList: IBaseDirectoryListItemType[],
  type: IBaseTypesType, // 资源类型
  cover: string, // 封面
  desc: string, // 简介
  tags: string[], // 标签
  top: boolean, // 置顶
  order: number, // 排序 越小越靠前
  createdAt: Date, // 创建时间
  createdBy: string, // 创建人
  updatedAt: Date, // 创建时间
  updatedBy: string // 修改人
}

export type IBaseDirectoryListItemType = Pick<IBaseFieldsType, 'id' | 'title' | 'directory' | 'type' | 'cover' | 'desc' | 'tags'>

export interface ICommentType {
  id: string,
  title: string, // 标题
  authorId: string, // 创建人
  replyId: string, // 创建人
  content: string, // 正文
  createdAt: Date, // 创建时间
  updatedAt: Date // 修改时间
}

export interface IResponeBodyType<T> {
  code: number,
  msg: string,
  data: T
}

export interface IResponePageType<T> {
  list: T[],
  page: number,
  pagesize: number,
  total: number
}

export interface IFileUploadType {
  domain: string,
  filepath: string
}

export interface IPageType<T> {
  page: number,
  pagesize: number,
  conditions?: T
}

export interface ISearchParamsType {
  keyword: string,
  directory: string[]
}

export interface INavigationType {
  title: string,
  url: string,
  icon?: string
}

export enum IClipboardType {
  NONE,
  COPY,
  CUT
}

export interface ISearchAllDataType {
  documents: IBaseFieldsType[],
  books: IBaseFieldsType[]
}
