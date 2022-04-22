import * as TypesBase from '../../../../types/base'
import * as TypesDocument from '../../../../types/document'

export import FileFormType = TypesBase.IBaseTypesType
export type FormType = TypesDocument.IDocumentFormType
export type DocumentState = {
  directory: string[],
  list: TypesDocument.IDocumentPageListItemType[],
  keyword: string,
  id: string,
  fileFormVisible: boolean,
  fileFormType: FileFormType,
  fileFormInitValue: TypesDocument.IDocumentFormType
}
