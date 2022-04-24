export interface IAdminType {
  _id: string,
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

export type IUserInfoType = {
  userinfo: IAdminType,
  token: string
}

export type ISigninType = Pick<IAdminType, 'username' | 'password'>

export type IAdminAddType = Omit<IAdminType, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>

export type IAdminUpdateSelfPasswordType = {
  oldPassword: string,
  password: string,
  repeatPassword: string
}

export type IAdminUpdateSelfInfoType = Partial<Pick<IAdminType, 'avatar' | 'nickname' | 'mobile' | 'email'>>
