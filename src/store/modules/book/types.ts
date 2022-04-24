import * as TypesBase from '@/types/base'
import * as TypesBook from '@/types/book'

export type BookState = {
  currentId: string,
  directory: string[],
  list: TypesBook.IBookType[],
  keyword: string,

  bookFormDrawerId: string,
  bookFormDrawerType: TypesBase.IBaseTypesType,
  bookFormDrawerVisible: boolean,

  clipboard: TypesBook.IBookType | null,
  clipboardType: TypesBase.IClipboardType
}
