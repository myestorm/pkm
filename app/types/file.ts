import { HydratedDocument, Types } from 'mongoose'

export interface IFileType {
  _id: Types.ObjectId,
  type: string,
  filepath: string,
  rootpath: string,
  base: string,
  ext: string,
  name: string,

  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string
}

export type IFileSchemaType = Omit<IFileType, '_id'>
export type IFileModelType = HydratedDocument<
  IFileSchemaType
>

export type IFileQueryType = Partial<IFileType>
