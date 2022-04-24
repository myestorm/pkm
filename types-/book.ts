import { HydratedDocument, Types } from 'mongoose'

export interface INoteType<T> {
  _id: T,
  content: string,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string
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
  notes: INoteType<T>[],
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string
}

export type IBookDataType = IBookType<Types.ObjectId>
export type INoteDataType = INoteType<Types.ObjectId>

export type IBookModelType = HydratedDocument<
  IBookDataType & {
    notes: Types.DocumentArray<IBookType<Types.ObjectId>> & Types.Subdocument
  }
>

// controllers
export type IBookAddType = Omit<IBookType<string>, '_id' | 'notes' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>
export type IBookUpdateType = IBookAddType & { _id: string }

export type INoteControlAddType = Pick<INoteType<string>, 'content' | 'createdBy' | 'updatedBy'>
export type INoteControlReurnType = INoteType<Types.ObjectId>

// router
export type IBookRouteAddType = Omit<IBookType<string>, '_id' | 'notes' | 'createdAt' | 'updatedAt'>
export type IBookRouteUpdateType = IBookRouteAddType & { _id: string }

// FE
export type IBookDataApiType = IBookType<string>
export type IBookDataFormType = IBookAddType & { _id?: string }

export type INoteApiAddType = Pick<INoteType<string>, 'content'>
export type INoteApiReurnType = INoteType<string>
