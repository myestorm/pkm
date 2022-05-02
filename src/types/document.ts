import * as BaseTypes from './base'

export interface IDocumentType extends BaseTypes.IBaseFieldsType {
  content: string,
  comments: BaseTypes.ICommentType[]
}

export type IDocumentCreateType = Pick<IDocumentType, 'title' | 'directory' | 'cover' | 'desc' | 'tags' | 'type'>
export type IDocumentUpdateType = Partial<IDocumentCreateType>

export type IDocumentQueryType = Partial<IDocumentType>
