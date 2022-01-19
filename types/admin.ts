import { HydratedDocument, Types } from 'mongoose'
export interface IAdminUserType<T> {
  _id: T,
  username: string,
  password: string,
  avatar: string,
  nickname: string,
  mobile: string,
  email: string,
  createdAt: Date,
  updatedAt: Date
}

export type IAdminUserMongoType = IAdminUserType<Types.ObjectId>

export type ISchemaAdminType = Omit<IAdminUserType<Types.ObjectId>, '_id'>
export type IAdminModelType = HydratedDocument<
  ISchemaAdminType
>

export type IAdminUserAddType = Omit<IAdminUserType<string>, '_id' | 'createdAt' | 'updatedAt'>

export type ISigninType = Pick<IAdminUserType<string>, 'username' | 'password'>

export type IFeAdminUserType = Partial<IAdminUserType<string>>

export type IUserInfoType = {
  userinfo: IFeAdminUserType,
  token: string
}
