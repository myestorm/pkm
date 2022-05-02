import jwt from 'jsonwebtoken'
import Admin from '../models/admin'

import * as TypesAdmin from '../types/admin'

import BaseController from '../core/controller'

class AdminController extends BaseController<TypesAdmin.IAdminModelType> {

  constructor () {
    super(Admin)
  }

  async signin (data: TypesAdmin.IAdminSigninType, secret: string): Promise<string | null> {
    const result = await this.findOne({
      username: data.username,
      password: this.methods.md5(data.password),
      status: 1
    })
    if (result) {
      const payload = {
        id: result._id,
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

  async checkUnique (condition: TypesAdmin.IAdminQueryType): Promise<boolean> {
    const info = await this.findOne(condition)
    return Boolean(info && info._id)
  }

  async createAdmin (data: TypesAdmin.IAdminCreateType): Promise<string> {
    data.password = this.methods.md5(data.password)
    const item = await this.create(data)
    return item.id
  }

  async updateAdmin (id: string, data: TypesAdmin.IAdminUpdateType): Promise<string> {
    if (data.password) {
      data.password = this.methods.md5(data.password)
    }
    await this.updateById(id, data)
    return id
  }

  async infoAdmin (id: string): Promise<TypesAdmin.IAdminType | null> {
    const result = await this.model.findById(id)
    return result
  }

  async listAdmin (filter: TypesAdmin.IAdminQueryType = {}): Promise<TypesAdmin.IAdminType[]> {
    const list = await this.model.find(filter, '-password -root').sort({
      _id: -1
    })
    return list
  }

}

export default AdminController
