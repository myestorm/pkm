import { MD5 } from 'crypto-js'
import jwt from 'jsonwebtoken'
import Admin from '../models/admin'

import * as TypesAdmin from '../types/admin'

import BaseController from '../core/controller'

class AdminController extends BaseController<TypesAdmin.IAdminModelType> {

  constructor () {
    super(Admin)
  }

  // 登录
  async signin (data: TypesAdmin.ISigninType, secret: string): Promise<string | null> {
    const result = await this.model.findOne({
      username: data.username,
      password: MD5(data.password).toString(),
      status: 1
    })
    if (result) {
      const payload = {
        _id: result._id,
        username: result.username,
        avatar: result.avatar,
        nickname: result.nickname,
        mobile: result.mobile,
        email: result.email
      }
      const token = jwt.sign(payload, secret, { expiresIn:  '7d' })
      return token
    } else {
      return null
    }
  }

  // 检查账号是否唯一
  async checkUnique (key: string, value: any): Promise<boolean> {
    const condition: {
      [key: string]: unknown
    } = {}
    condition[key] = value
    const info = await this.model.findOne(condition)
    return Boolean(info && info._id)
  }

  // 添加
  async addAdmin (data: TypesAdmin.IAdminAddType): Promise<string> {
    data.password = MD5(data.password).toString()
    const item = await this.model.create(data)
    return item._id.toString()
  }

  // 条件查询用户
  async infoCondition (condition: TypesAdmin.IQueryCondition): Promise<TypesAdmin.IAdminType | null> {
    if (condition.password) {
      condition.password = MD5(condition.password).toString()
    }
    return await Admin.findById(condition, {
      password: 0
    })
  }

  // // 所有用户
  // async list (): Promise<TypesAdmin.IAdminType[]> {
  //   const list = await Admin.find({}, '-password').sort({
  //     _id: -1
  //   })
  //   return list
  // }

  // 重置密码
  async resetPassword (id: string, updatedBy: string): Promise<string> {
    const pwd = '123456!@#$'
    let password = MD5(pwd).toString()
    password = MD5(password).toString()
    await this.model.findByIdAndUpdate(id, { password, updatedBy }, { 
      new: true, 
      upsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
    return pwd
  }

  // 修改用户状态 0 禁用 1 启用
  async disabled (id: string, status: number, updatedBy: string): Promise<string> {
    await this.model.findByIdAndUpdate(id, { status, updatedBy }, { 
      new: true, 
      upsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
    return id
  }

  // 修改自己的密码
  async updateSelfPassword (id: string, password: string): Promise<string> {
    const _password = MD5(password).toString()
    await this.model.findByIdAndUpdate(id, {
      password: _password
    }, { 
      new: true, 
      upsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
    return id
  }

  // 修改自己的账号信息
  async updateSelf (id: string, data: TypesAdmin.IAdminUpdateSelfInfoType): Promise<string> {
    const _data: TypesAdmin.IAdminUpdateSelfInfoType = {}
    if (data.avatar) {
      _data.avatar = data.avatar
    }
    if (data.nickname) {
      _data.nickname = data.nickname
    }
    if (data.mobile) {
      _data.mobile = data.mobile
    }
    if (data.email) {
      _data.email = data.email
    }
    await this.model.findByIdAndUpdate(id, _data, { 
      new: true, 
      upsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
    return id
  }

}

export default AdminController
