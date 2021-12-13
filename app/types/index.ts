/// <reference path ='../../node_modules/koa-body/index.d.ts'/>

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
