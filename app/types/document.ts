import { HydratedDocument, Types } from 'mongoose'
import * as BaseTypes from './base'

export interface IDocumentType extends BaseTypes.IBaseFieldsType {
  content: string,
  comments: BaseTypes.ICommentType[]
}

export type IDocumentSchemaType = Omit<IDocumentType, '_id'>
export type IDocumentModelType = HydratedDocument<
  IDocumentSchemaType & {
    comments: Types.DocumentArray<
      BaseTypes.ICommentType
    > & Types.Subdocument
  }
>

export type IDocumentCreateType = Pick<IDocumentType, 'title' | 'directory' | 'cover' | 'desc' | 'tags' | 'type' | 'content'>
export type IDocumentUpdateType = Partial<IDocumentCreateType>

export type IDocumentQueryType = Partial<IDocumentType>
