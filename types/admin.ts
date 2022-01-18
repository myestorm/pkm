import { HydratedDocument, Types } from 'mongoose'
export interface IAdminUserType {
  _id: Types.ObjectId,
  username: string,
  password: string,
  avatar: string,
  nickname: string,
  mobile: string,
  email: string,
  createdAt: Date,
  updatedAt: Date
}

export type ISchemaAdminType = Omit<IAdminUserType, '_id'>
export type IAdminModelType = HydratedDocument<
  ISchemaAdminType
>

export type IAdminUserAddType = Omit<IAdminUserType, '_id' | 'createdAt' | 'updatedAt'>

export type ISigninType = Pick<IAdminUserType, 'username' | 'password'>

export type IFeAdminUserType = Partial<IAdminUserType>

export type IUserInfoType = {
  userinfo: IFeAdminUserType,
  token: string
}
