import { MD5 } from 'crypto-js'
import jwt from 'jsonwebtoken'
import Admin from '../models/admin'
import { IAdminUserType, ISigninType } from '../types/admin'

import BaseController from '../core/controller'

class AdminController extends BaseController {

  async signin (data: ISigninType, secret: string): Promise<string | null> {
    const result = await Admin.findOne({
      username: data.username,
      password: MD5(data.password).toString()
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

  async add (data: IAdminUserType): Promise<IAdminUserType> {
    data.password = MD5(data.password).toString()
    return await new Admin(data).save()
  }

  async remove (id: string): Promise<IAdminUserType | null> {
    return await Admin.findByIdAndRemove(id)
  }

  async update (id: string, data: IAdminUserType): Promise<IAdminUserType | null> {
    return await Admin.findByIdAndUpdate(id, data, { 
      new: true, 
      upsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
  }

  async info (id: string): Promise<IAdminUserType | null> {
    return await Admin.findById(id, {
      password: 0
    })
  }

}

export default AdminController