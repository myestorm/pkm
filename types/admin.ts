import { HydratedDocument, Types } from 'mongoose'
export interface IAdminUserType<T> {
  _id: T,
  username: string,
  password: string,
  avatar: string,
  nickname: string,
  mobile: string,
  email: string,
  root: boolean, // 初始账号
  status: number, // 1 可用 0 禁用
  createdBy: string,
  createdAt: Date,
  updatedBy: string,
  updatedAt: Date
}

export type IObjectIdAdminType = IAdminUserType<Types.ObjectId>
export type IStrinIdAdminType = IAdminUserType<string>

// models
export type IModelAdminType = HydratedDocument<
  IObjectIdAdminType
>

// controllers & routes
export type IControllerAdminReurnType = Omit<IObjectIdAdminType, 'password'>
export type IControllerAdminAddType = Omit<IObjectIdAdminType, '_id' | 'createdAt' | 'updatedAt'>
export type IControllerUpdateSelfType = Partial<Pick<IStrinIdAdminType, 'password' | 'avatar' | 'nickname'>>
export type ISigninType = Pick<IStrinIdAdminType, 'username' | 'password'>
export type IUserInfoType = {
  userinfo: IApiAdminReurnType,
  token: string
}

// apis
export type IApiAdminReurnType = Omit<IStrinIdAdminType, 'password'>
export type IApiAdminAddType = Omit<IStrinIdAdminType, '_id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'updatedBy'>
export type IApiAdminUpdateSelfType = Partial<Pick<IStrinIdAdminType, 'password' | 'avatar' | 'nickname'> & {
  oldPassword: string,
  repeatPassword: string
}>
