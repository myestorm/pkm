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
