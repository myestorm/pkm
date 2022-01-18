import { HydratedDocument, Types } from 'mongoose'

export interface INoteType {
  _id: Types.ObjectId,
  content: string,
  order: number,
  createdAt: Date,
  updatedAt: Date
}

export interface IBookType {
  _id: Types.ObjectId,
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
  children: INoteType[],
  createdAt: Date,
  updatedAt: Date
}

export interface IBookrackGroupType {
  _id: Types.ObjectId,
  title: string,
  desc: string,
  order: number,
  children: IBookType[],
  createdAt: Date,
  updatedAt: Date
}

// mongoose model type
export type ISchemaBookType = Omit<IBookType, '_id'>
export type ISchemaNoteType = Omit<INoteType, '_id'>
export type ISchemaBookrackGroupType = Omit<IBookrackGroupType, '_id'>
export type IBookrackModelType = HydratedDocument<
  ISchemaBookrackGroupType & {
    children: Types.DocumentArray<IBookType> & Types.Subdocument
  }
>

// controller
export type IControllerBookrackGroupAddType = Omit<IBookrackGroupType, '_id' | 'children'>
export type IControllerBookAddType = Omit<IBookType, '_id'>
export type IControllerNoteAddType = Omit<INoteType, '_id'>

// apis
export type IApisBookrackGroupAddType = Pick<IBookrackGroupType, 'title' | 'desc'>
export type IApisBookrackGroupUpdateType = IApisBookrackGroupAddType & {
  _id?: string
}

export type IApisBookAddType = Omit<IBookType, '_id' | 'createdAt' | 'updatedAt'> & {
  groupId?: string
}
export type IApisBookUpdateType = IApisBookAddType & {
  _id?: string
}
export type IApisBookRemoveType = {
  groupId: string,
  id: string
}

export type IApisNoteAddType = Omit<INoteType, '_id' | 'createdAt' | 'updatedAt'> & {
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
