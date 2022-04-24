export enum IBaseTypesType {
  FILE = 'file',
  FOLDER = 'folder'
}
export enum IClipboardType {
  NONE,
  COPY,
  CUT
}
export interface IBaseFieldsType {
  _id: string,
  title: string, // 标题
  directory: string[], // 所属目录
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

export interface ICommentType {
  _id: string,
  title: string, // 标题
  authorId: string, // 创建人
  replyId: string, // 创建人
  content: string, // 正文
  createdAt: Date, // 创建时间
  updatedAt: Date // 修改时间
}

export interface IPageType<T> {
  page: number,
  pagesize: number,
  conditions?: T
}

export interface IResponeBodyType<T> {
  code: number,
  msg: string,
  data: T
}

export interface IResponePageBodyType<T> {
  list: T[],
  page: number,
  pagesize: number,
  total: number
}

export interface IFileUploadType {
  domain: string,
  filepath: string
}

export interface ISearchParamsType {
  keyword: string,
  directory: string[]
}

export type IBreadcrumbType = Pick<IBaseFieldsType, '_id' | 'directory' | 'title'>
