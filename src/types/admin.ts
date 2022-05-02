export interface IAdminType {
  id: string,
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

export type IAdminSigninType = Pick<IAdminType, 'username' | 'password'>
export type IAdminCreateType = Pick<IAdminType, 'username' | 'password' | 'avatar' | 'nickname' | 'mobile' | 'email'>
export type IAdminUpdateType = Partial<IAdminCreateType>

export type IAdminChangePasswordType = {
  oldPassword: string,
  password: string,
  repeatPassword: string
}
export type IAdminChangeAccountInfoType = Partial<Pick<IAdminType, 'avatar' | 'nickname' | 'mobile' | 'email'>>
export type IAdminQueryType = Partial<Pick<IAdminType, 'username' | 'mobile' | 'email' | 'status'>>

export type IAdminContextUserType = {
  userinfo: Pick<IAdminType, 'id' | 'username' | 'avatar' | 'nickname' | 'mobile' | 'email'>,
  token: string
}
