import { HydratedDocument, Types } from 'mongoose'
import * as BaseTypes from './base'

export interface IDocumentType extends BaseTypes.IBaseFieldsType {
  content: string,
  comments: BaseTypes.ICommentType[]
}

export type ISchemaDocumentType = Omit<IDocumentType, '_id'>
export type IDocumentModelType = HydratedDocument<
  ISchemaDocumentType & {
    comments: Types.DocumentArray<
      BaseTypes.ICommentType
    > & Types.Subdocument
  }
>

export type IDocumentAddType = Pick<IDocumentType, 'title' | 'directory' | 'cover' | 'desc' | 'tags' | 'type'>
export type IDocumentPartialType = Partial<IDocumentType>

export type IDocumentAddRouteType = IDocumentAddType & { _id: string }
