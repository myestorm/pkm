export interface IAdminUserType {
  _id: string,
  username: string,
  password: string,
  avatar: string,
  nickname: string,
  mobile: string,
  email: string,
  createdAt: Date,
  updatedAt: Date
}

export type IAdminUserAddType = Omit<IAdminUserType, '_id'>

export type ISigninType = Pick<IAdminUserType, 'username' | 'password'>

export type IFeAdminUserType = Omit<IAdminUserType, 'password'>

export type IUserInfoType = {
  userinfo: IFeAdminUserType,
  token: string
}
