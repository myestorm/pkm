import { IDocumentPageListItemType, IDocumentFormType, IDocumentTypeType } from '../../../../types/document'
export import FileFormType = IDocumentTypeType
export type FormType = IDocumentFormType
export type DocumentState = {
  parents: string[],
  list: IDocumentPageListItemType[],
  keyword: string,
  id: string,
  fileFormVisible: boolean,
  fileFormType: IDocumentTypeType,
  fileFormInitValue: IDocumentFormType
}
