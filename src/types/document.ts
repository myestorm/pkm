import * as BaseTypes from './base'

export interface IDocumentType extends BaseTypes.IBaseFieldsType {
  content: string,
  comments: BaseTypes.ICommentType[]
}

export type IDocumentFileFormType = Pick<IDocumentType, '_id' | 'directory' | 'title' | 'cover' | 'desc' | 'tags' | 'type'>
export type IDocumentFolderFormType = Pick<IDocumentType, '_id' | 'directory' | 'title' | 'desc' | 'type'>

export type IDocumentListType = Partial<IDocumentType>
export type IDocumentBreadcrumbType = Pick<IDocumentType, '_id' | 'directory' | 'title'>
