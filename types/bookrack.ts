import { HydratedDocument, Types } from 'mongoose'

export interface IBookType {
  _id: string,
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
  createdAt: Date,
  updatedAt: Date
}

export interface IBookrackGroupType {
  _id: string,
  title: string,
  desc: string,
  children: IBookType[],
  createdAt: Date,
  updatedAt: Date
}

// mongoose model type
export type ISchemaBookType = Omit<IBookType, '_id'>
export type ISchemaBookrackGroupType = Omit<IBookrackGroupType, '_id'>
export type IBookrackModelType = HydratedDocument<
  ISchemaBookrackGroupType & {
    children: Types.DocumentArray<IBookType> & Types.Subdocument
  }
>

// controller
export type IControllerBookrackGroupAddType = Omit<IBookrackGroupType, '_id' | 'children'>
export type IControllerBookAddType = Omit<IBookType, '_id'>

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
