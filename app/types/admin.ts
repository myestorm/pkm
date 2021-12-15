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