import { HydratedDocument, Types } from 'mongoose'
export interface IAdminUserType<T> {
  _id: T,
  username: string,
  password: string,
  avatar: string,
  nickname: string,
  mobile: string,
  email: string,
  root: boolean, // 是否是初始账号
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
export type IControllerQueryCondition = Partial<Pick<IStrinIdAdminType, '_id' | 'username' | 'password' | 'mobile' | 'email' | 'status'>>
export type ISigninType = Pick<IStrinIdAdminType, 'username' | 'password'>
export type IUserInfoType = {
  userinfo: IApiAdminReurnType,
  token: string
}

// apis
export type IApiAdminReurnType = Omit<IStrinIdAdminType, 'password'>
export type IApiAdminAddType = Omit<IStrinIdAdminType, '_id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'updatedBy'>
export type IApiAdminUpdateSelfPasswordType = {
  oldPassword: string,
  password: string,
  repeatPassword: string
}
export type IApiAdminUpdateSelfInfoType = Partial<Pick<IStrinIdAdminType, 'avatar' | 'nickname' | 'mobile' | 'email'>>
