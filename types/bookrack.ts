import { HydratedDocument, Types } from 'mongoose'

export interface INoteType<T> {
  _id: T,
  content: string,
  order: number,
  createdAt: Date,
  updatedAt: Date
}

export interface IBookType<T> {
  _id: T,
  title: string,
  author: string,
  cover: string,
  desc: string,
  readed: boolean,
  heard: boolean,
  purchased: boolean,
  ISBN: string,
  tags: string[],
  rating: number,
  order: number,
  children: INoteType<T>[],
  createdAt: Date,
  updatedAt: Date
}

export interface IBookrackGroupType<T> {
  _id: T,
  title: string,
  desc: string,
  order: number,
  children: IBookType<T>[],
  createdAt: Date,
  updatedAt: Date
}

export type IBookrackGroupMongoType = IBookrackGroupType<Types.ObjectId>
export type INoteMongoType = INoteType<Types.ObjectId>
export type IBookMongoType = IBookType<Types.ObjectId>

// mongoose model type
export type ISchemaBookType = Omit<IBookType<Types.ObjectId>, '_id'>
export type ISchemaNoteType = Omit<INoteType<Types.ObjectId>, '_id'>
export type ISchemaBookrackGroupType = Omit<IBookrackGroupMongoType, '_id'>
export type IBookrackModelType = HydratedDocument<
  ISchemaBookrackGroupType & {
    children: Types.DocumentArray<IBookType<Types.ObjectId>> & Types.Subdocument
  }
>

// controller
export type IControllerBookrackGroupAddType = Omit<IBookrackGroupType<string>, '_id' | 'children'>
export type IControllerBookAddType = Omit<IBookType<string>, '_id'>
export type IControllerNoteAddType = Omit<INoteType<string>, '_id'>

// apis
export type IApisBookrackGroupAddType = Pick<IBookrackGroupType<string>, 'title' | 'desc'>
export type IApisBookrackGroupUpdateType = IApisBookrackGroupAddType & {
  _id?: string
}

export type IApisBookAddType = Omit<IBookType<string>, '_id' | 'createdAt' | 'updatedAt'> & {
  groupId?: string
}
export type IApisBookUpdateType = IApisBookAddType & {
  _id?: string
}
export type IApisBookRemoveType = {
  groupId: string,
  id: string
}

export type IApisNoteAddType = Omit<INoteType<string>, '_id' | 'createdAt' | 'updatedAt'> & {
  groupId?: string,
  bookId?: string
}
export type IApisNoteUpdateType = IApisNoteAddType & {
  _id?: string
}
export type IApisNoteRemoveType = {
  groupId: string,
  bookId: string,
  id: string
}
