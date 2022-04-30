import { Context, Next } from 'koa'
import mongoose, { Schema } from 'mongoose'
import mongoConfig from '../.mongo.config'
import * as TypesAdmin from '../types/admin'

interface IUserType {
  id: string
}
const user: IUserType = {
  id: ''
}

function setSchemaOptions (schema: Schema, options = {}) {
  schema.set('toObject', { virtuals: true })
  schema.set('toJSON', {
    virtuals: true
    // transform : (doc, result) => {
    //   const res = {
    //     ...result,
    //     id : result._id
    //   }
    //   delete res._id
    //   delete res.__v
    //   return res
    // }
  })
}

function createUpdateByPlugin (schema: Schema, options = {}) {
  schema.pre('save', function (next) {
    if (!this.createdBy) {
      this.createdBy = user.id
    }
    this.updatedBy = user.id
    next()
  })
  schema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    const postData = {
      ...this.getUpdate(),
      updatedBy: user.id
    }
    this.setUpdate(postData)
    next()
  })
}

mongoose.plugin(setSchemaOptions, {})
mongoose.plugin(createUpdateByPlugin, {})
mongoose.connect(mongoConfig)
mongoose.connection.on('error', console.error)

export default () => {
  return async (ctx: Context, next: Next) => {
    const userinfo = ctx.state.userinfo as TypesAdmin.IAdminType
    if (userinfo?._id) {
      user.id = userinfo._id.toString()
    }
    await next()
  }
}
