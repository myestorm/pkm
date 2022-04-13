import { IBookDataApiType, IBookDataFormType } from '../../../../types/book'
export type FormType = IBookDataFormType
export type BookState = {
  list: IBookDataApiType[],
  keyword: string,
  id: string,
  fileFormVisible: boolean,
  fileFormInitValue: IBookDataFormType
}
