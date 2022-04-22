import * as TypesDocument from '../../../../types/document'

export type DocumentState = {
  directory: string[],
  list: TypesDocument.IDocumentStringIdType[],
  keyword: string,
  id: string,
  documentFormDrawerVisible: boolean
}
