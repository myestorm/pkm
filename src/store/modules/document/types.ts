import * as TypesBase from '@/types/base'
import * as TypesDocument from '@/types/document'

export type DocumentState = {
  currentId: string,
  currentType: string,
  directory: string[],
  list: TypesDocument.IDocumentType[],
  keyword: string,

  documentFormDrawerId: string,
  documentFormDrawerType: TypesBase.IBaseTypesType,
  documentFormDrawerVisible: boolean,

  clipboard: TypesDocument.IDocumentType | null,
  clipboardType: TypesBase.IClipboardType
}
