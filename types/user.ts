export interface IUserType<T> {
  _id: T,
  usename: string, // 用户名
  nickname: string, // 昵称
  email: string, // 邮箱
  mobile: string, // 电话
  createdAt: Date, // 创建时间
  updatedAt: Date // 修改时间
}
