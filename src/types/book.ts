import * as BaseTypes from './base'

export interface INoteType {
  id: string,
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

export type IBookCreateType = Pick<IBookType, 'title' | 'directory' | 'cover' | 'desc' | 'tags' | 'type' | 'author' | 'readed' | 'heard' | 'purchased' | 'ISBN' | 'rating'>
export type IBookUpdateType = Partial<IBookCreateType>
export type IBookQueryType = Partial<IBookType>

export type INoteCreateType = Pick<INoteType, 'content'>
export type INoteUpdateType = INoteCreateType
