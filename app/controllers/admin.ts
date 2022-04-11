import { MD5 } from 'crypto-js'
import jwt from 'jsonwebtoken'
import Admin from '../models/admin'
import { IControllerAdminReurnType, IControllerAdminAddType, ISigninType, IControllerUpdateSelfType } from '../../types/admin'

import BaseController from '../core/controller'

class AdminController extends BaseController {

  async signin (data: ISigninType, secret: string): Promise<string | null> {
    const result = await Admin.findOne({
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

  async checkUnique (key: string, value: any): Promise<boolean> {
    const condition: {
      [key: string]: unknown
    } = {}
    condition[key] = value
    const info = await Admin.findOne(condition)
    return Boolean(info && info._id)
  }

  async add (data: IControllerAdminAddType): Promise<string> {
    data.password = MD5(data.password).toString()
    const item = await Admin.create(data)
    return item._id.toString()
  }

  async remove (id: string): Promise<string> {
    const result = await Admin.findByIdAndRemove(id)
    return result._id.toString()
  }

  async update (id: string, data: IControllerAdminAddType): Promise<string> {
    const result = await Admin.findByIdAndUpdate(id, data, { 
      new: true, 
      upsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
    return result._id.toString()
  }

  async info (id: string): Promise<IControllerAdminReurnType | null> {
    return await Admin.findById(id, {
      password: 0
    })
  }

  async list (): Promise<IControllerAdminReurnType[]> {
    const list = await Admin.find({}, '-password').sort({
      _id: -1
    })
    return list
  }

  async resetPassword (id: string, updatedBy: string): Promise<string> {
    const pwd = '123456!@#$'
    let password = MD5(pwd).toString()
    password = MD5(password).toString()
    await Admin.findByIdAndUpdate(id, { password, updatedBy }, { 
      new: true, 
      upsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
    return pwd
  }

  async disabled (id: string, status: number, updatedBy: string): Promise<string> {
    await Admin.findByIdAndUpdate(id, { status, updatedBy }, { 
      new: true, 
      upsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
    return id
  }

  async checkOldPassword (id: string, password: string): Promise<boolean> {
    const result = await Admin.findOne({
      _id: id,
      password: MD5(password).toString(),
      status: 1
    })
    return Boolean(result)
  }

  async updateSelf (id: string, data: IControllerUpdateSelfType): Promise<string> {
    if (data.password) {
      data.password = MD5(data.password).toString()
    }
    const result = await Admin.findByIdAndUpdate(id, data, { 
      new: true, 
      upsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
    return result._id.toString()
  }

}

export default AdminController
