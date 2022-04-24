import { HydratedDocument, Types } from 'mongoose'
import * as BaseTypes from './base'
import { ICommentType } from './comment'

export interface IDocumentType<T> extends BaseTypes.IBaseFieldsType<T> {
  content: string,
  comments: ICommentType<T>[]
}

export type ISchemaDocumentType = Omit<IDocumentType<Types.ObjectId>, '_id'>
export type IDocumentModelType = HydratedDocument<
  ISchemaDocumentType & {
    comments: Types.DocumentArray<
      ICommentType<Types.ObjectId>
    > & Types.Subdocument
  }
>

export type IDocumentDataType = IDocumentType<Types.ObjectId>
export type IDocumentAddType = Omit<IDocumentType<string>, '_id' | 'createdAt' | 'updatedAt' | 'comments' | 'createdBy' | 'updatedBy'>
export type IDocumentUpdateType = IDocumentAddType & { _id: string }


export type IDocumentFormType = IDocumentAddType & { _id?: string }
export type IDocumentPageListItemType = IDocumentType<string>
export type IDocumentSearchType = Pick<IDocumentType<string>, '_id' | 'title' | 'directory' | 'type' | 'desc' | 'top' | 'cover' | 'updatedAt'>

// route
export type IDocumentRouteAddType = Omit<IDocumentType<string>, '_id' | 'createdAt' | 'updatedAt' | 'comments'>
export type IDocumentRouteUpdateType = IDocumentRouteAddType & { _id: string }

// apis
export type IDocumentStringIdType = IDocumentType<string>
export type IDocumentFilterType = Partial<IDocumentType<string>>
