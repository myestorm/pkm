/// <reference path ='../node_modules/koa-body/index.d.ts'/>

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

export interface IPageType<T> {
  page: number,
  pagesize: number,
  conditions?: T
}

// 使某个type变成可选
export type PartialKey<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>> & Pick<Partial<T>, U>
