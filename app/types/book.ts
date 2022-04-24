import { HydratedDocument, Types } from 'mongoose'
import * as BaseTypes from './base'

export interface INoteType {
  _id: Types.ObjectId,
  content: string,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string
}

export interface IBookType extends BaseTypes.IBaseFieldsType {
  author: string,
  readed: boolean,
  heard: boolean,
  purchased: boolean,
  ISBN: string,
  rating: number,
  notes: INoteType[],
  comments: BaseTypes.ICommentType[]
}

export type ISchemaBookType = Omit<IBookType, '_id'>
export type IBookModelType = HydratedDocument<
  ISchemaBookType & {
    notes: Types.DocumentArray<INoteType> & Types.Subdocument,
    comments: Types.DocumentArray<
      BaseTypes.ICommentType
    > & Types.Subdocument
  }
>

export type IBookAddType = Pick<IBookType, 'title' | 'directory' | 'cover' | 'desc' | 'tags' | 'type' | 'author' | 'readed' | 'heard' | 'purchased' | 'ISBN' | 'rating'>
export type IDocumentPartialType = Partial<IBookType>
export type INoteAddType = Pick<INoteType, 'content'>

export type IDocumentAddRouteType = IBookAddType & { _id: string }