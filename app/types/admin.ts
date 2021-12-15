export interface IAdminUserType {
  _id?: string,
  username: string,
  password: string,
  avatar?: string,
  nickname?: string,
  mobile?: string,
  email?: string,
  createdAt?: Date,
  updatedAt?: Date
}

export interface ISigninType {
  username: string,
  password: string
}

export type IFeAdminUserType = Omit<IAdminUserType, 'password'>

export type IUserInfoType = {
  userinfo: IFeAdminUserType,
  token: string
}
