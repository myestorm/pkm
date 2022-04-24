import { HydratedDocument, Types } from 'mongoose'
import * as BaseTypes from './base'

export interface IAdminType {
  _id: Types.ObjectId,
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

export type ISchemaAdminType = Omit<IAdminType, '_id'>
export type IAdminModelType = HydratedDocument<
  ISchemaAdminType
>

export type ISigninType = Pick<IAdminType, 'username' | 'password'>
export type IAdminAddType = Omit<IAdminType, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
export type IAdminUpdateSelfPasswordType = {
  oldPassword: string,
  password: string,
  repeatPassword: string
}
export type IAdminUpdateSelfInfoType = Partial<Pick<IAdminType, 'avatar' | 'nickname' | 'mobile' | 'email'>>
export type IQueryCondition = Partial<Pick<IAdminType, '_id' | 'username' | 'password' | 'mobile' | 'email' | 'status'>>

export type IUserInfoType = {
  userinfo: IAdminType,
  token: string
}

