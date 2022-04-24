import * as TypesBook from '@/types/book'
export type FormType = TypesBook.IBookDataFormType
export type BookState = {
  list: TypesBook.IBookType[],
  keyword: string,
  id: string,
  fileFormVisible: boolean,
  fileFormInitValue: FormType
}
